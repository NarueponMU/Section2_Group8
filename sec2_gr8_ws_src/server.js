import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const port = process.env.PORT || 5050;

// ==========================
// // Middleware
// สามารถรับไฟล์ base64 ได้ถึง 10 MB
// ==========================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// ==========================
// DB Connection
// ==========================
let connection;
try {
  connection = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME || "coffee",
  });

  await connection.query("SELECT 1");
  console.log("✅ Database connected successfully");
} catch (err) {
  console.error("❌Database connection failed:", err.message);
}

// ==========================
// LOGIN
// ==========================
app.post("/api/login", async (req, res) => {
  const { Username, Password } = req.body;

  if (!Username || !Password) {
    return res.status(400).json({
      found: false,
      message: "Missing Username or Password",
    });
  }

  try {
    const [rows] = await connection.query(
      "SELECT User_ID, Username, Password FROM User_Account WHERE Username = ? LIMIT 1",
      [Username]
    );

    if (rows.length === 0) {
      return res.json({ found: false, message: "User not found" });
    }

    const user = rows[0];

    // compare hashed password
    const match = await bcrypt.compare(Password, user.Password);
    if (!match) {
      return res.json({ found: false, message: "Incorrect password" });
    }

    // Login success
    res.cookie("session", user.Username, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
    });

    console.log("LOGIN SUCCESS:", user.Username);

    return res.json({ found: user.Username });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// ==========================
// COFFEE QUOTE (Public API)
// ==========================
app.get("/api/coffee-quote", async (req, res) => {
  const coffeeList = [
    { name: "Americano", image: "/images/coffeemenu/americano.png" },
    { name: "Cappuccino", image: "/images/HomePage/icaramelmac.png" },
    { name: "Matcha Latte", image: "/images/HomePage/mtchlatte.png" },
  ];

  try {
    const response = await fetch("https://zenquotes.io/api/random");
    const data = await response.json();

    const coffee = coffeeList[Math.floor(Math.random() * coffeeList.length)];

    res.json({
      quote: data[0]?.q || "Coffee is always a good idea.",
      author: data[0]?.a || "Anonymous",
      coffeeName: coffee.name,
      coffeeImage: coffee.image,
    });
  } catch (err) {
    res.status(500).json({
      quote: "Coffee is always a good idea.",
      author: "Anonymous",
      coffeeName: coffeeList[0].name,
      coffeeImage: coffeeList[0].image,
    });
  }
});

// ==========================
// GET ALL USERS
// ==========================
app.get("/api/users", async (req, res) => {
  try {
    const [rows] = await connection.query(`
      SELECT 
        u.User_ID,
        u.Username,
        u.First_Name,
        u.Last_Name,
        u.Address,
        u.Phone_Number,
        u.Role,
        u.Is_Active,
        u.Last_Login,
        e.Email
      FROM User_Account u
      LEFT JOIN User_Email e ON u.User_ID = e.User_ID
      ORDER BY u.User_ID
    `);

    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching users:", err.message);
    res.status(500).json({ message: "Database Error" });
  }
});

// ==========================
// SEARCH USERS
// ==========================
app.get("/api/users/search", async (req, res) => {
  const { userID, username, email } = req.query;

  let sql = `
    SELECT 
      u.User_ID,
      u.Username,
      u.First_Name,
      u.Last_Name,
      u.Address,
      u.Phone_Number,
      u.Role,
      u.Is_Active,
      u.Last_Login,
      e.Email,
      u.Profile_Image
    FROM User_Account u
    LEFT JOIN User_Email e ON u.User_ID = e.User_ID
    WHERE 1=1
  `;
  const params = [];

  // Search conditions
  if (userID) {
    sql += " AND u.User_ID LIKE ?";
    params.push(`%${userID}%`);
  }

  if (username) {
    sql += " AND u.Username LIKE ?";
    params.push(`%${username}%`);
  }

  if (email) {
    sql += " AND e.Email LIKE ?";
    params.push(`%${email}%`);
  }

  sql += " ORDER BY u.User_ID";

  try {
    const [rows] = await connection.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("❌ Search user error:", err.message);
    res.status(500).json({ message: "Search Error" });
  }
});

// ==========================
// GET ALL PRODUCTS
// ==========================
app.get("/api/coffee", async (req, res) => {
  try {
    const [rows] = await connection.query(
      "SELECT * FROM Product ORDER BY CAST(Product_ID AS UNSIGNED)"
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching products:", err.message);
    res.status(500).json({ message: "Database Error" });
  }
});


// ==========================
// CREATE USER
// ==========================
app.post("/api/users", async (req, res) => {
  const u = req.body;

  if (!u.First_Name || !u.Last_Name || !u.Username || !u.Password)
    return res.status(400).json({ success: false, message: "Missing fields" });

  try {
    const [rows] = await connection.query(
      "SELECT User_ID FROM User_Account ORDER BY User_ID DESC LIMIT 1"
    );

    let newId = "U001";
    if (rows.length > 0) {
      const last = parseInt(rows[0].User_ID.replace("U", ""));
      newId = "U" + String(last + 1).padStart(3, "0");
    }

    const hashed = await bcrypt.hash(u.Password, 10);

    await connection.query(
      `
      INSERT INTO User_Account 
(User_ID, Username, Password, Create_Date, Date_of_Birth, First_Name, Last_Name, Address, Phone_Number, Role, Is_Active, Profile_Image)
VALUES (?, ?, ?, CURDATE(), ?, ?, ?, ?, ?, 'CUSTOMER', 1, ?)`,
      [
        newId,
        u.Username,
        hashed,
        u.Date_of_Birth,
        u.First_Name,
        u.Last_Name,
        u.Address,
        u.Phone_Number,
        u.Profile_Image || null
      ]
    );

    if (u.Email) {
      await connection.query(
        `INSERT INTO User_Email (User_ID, Email) VALUES (?, ?)`,
        [newId, u.Email]
      );
    }

    res.json({ success: true, User_ID: newId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.sqlMessage });
  }
});

// ==========================
// GET ALL PRODUCTS
// ==========================
app.get("/api/coffee", async (req, res) => {
  try {
    const [rows] = await connection.query(
      "SELECT * FROM Product ORDER BY CAST(Product_ID AS UNSIGNED)"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching products:", err.message);
    res.status(500).json({ message: "Database Error" });
  }
});

// ==========================
// GET PRODUCT BY ID
// ==========================
app.get("/api/coffee/:id", async (req, res) => {
  try {
    const [rows] = await connection.query(
      "SELECT * FROM Product WHERE Product_ID = ?",
      [req.params.id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Product not found" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Database Error" });
  }
});

// ==========================
// PRODUCT SEARCH
// ==========================

function normalizeSize(size) {
  return size.replace(/\s+/g, "").toLowerCase();
}

function normalizeSource(source) {
  return source.trim().toLowerCase();
}

app.get("/product/search", async (req, res) => {
  const { name, source, roast, size } = req.query;

  let sql = "SELECT * FROM Product WHERE 1=1";
  const params = [];

  // NAME
  if (name && name.trim() !== "") {
    sql += " AND Product_Name LIKE ?";
    params.push(`%${name}%`);
  }

  // SOURCE (รองรับหลายประเทศในช่องเดียว เช่น "Brazil, Japan")
  if (source && source.trim() !== "") {
    sql += " AND LOWER(Product_Source) LIKE ?";
    params.push(`%${normalizeSource(source)}%`);
  }

  // ROAST
  if (roast && roast !== "all") {
    sql += " AND Roast_Level = ?";
    params.push(roast);
  }

  // SIZE
  if (size) {
    const sizeList = size.split(",").map((s) => normalizeSize(s));

    const placeholders = sizeList.map(() => "?").join(",");

    sql += ` AND REPLACE(LOWER(Size), ' ', '') IN (${placeholders})`;
    params.push(...sizeList);
  }

  sql += " ORDER BY CAST(Product_ID AS UNSIGNED)";

  try {
    const [rows] = await connection.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("❌ Search Error:", err);
    res.status(500).json({ message: "Search Error" });
  }
});

// ==========================
// INSERT PRODUCT
// ==========================

app.post('/product', async (req, res) => {
  const p = req.body;

  console.log("RECEIVED PRODUCT:", p);

  const sql = `
    INSERT INTO Product 
      (Product_Name, Product_Source, Roast_Level, Size, Taste_Note, Price_per_kg, Image_URL)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await connection.query(sql, [
      p.Product_Name,
      p.Product_Source,
      p.Roast_Level,
      p.Size,
      p.Taste_Note,
      p.Price_per_kg,
      p.Image_URL
    ]);

    return res.json({
      success: true,
      message: "Product inserted!",
      inserted_id: result.insertId,
      result
    });

  } catch (err) {
    console.error("❌ INSERT ERROR:", err);
    return res.status(500).json({
      success: false,
      error: err,
      message: err.sqlMessage
    });
  }
});

// method: POST
// URL: http://localhost:5050/product
// Body (raw JSON)
// {
// "Product_Name": "Kenya Blend",
// "Product_Source": "Kenya",
// "Roast_Level": "D",
// "Size": "500g",
// "Taste_Note": "Goodtaste",
// "Price_per_kg": 500,
// "Image_URL": "https://i.pinimg.com/736x/01/f9/72/01f9728512f92813ebbac859baf4fe12.jpg"
// }



// ==========================
// Update Product
// ==========================

app.put('/product/:id', async (req, res) => {
  const id = req.params.id;
  const p = req.body; 

  const sql = `
    UPDATE Product 
    SET Product_Name=?, Product_Source=?, Roast_Level=?, Size=?, Taste_Note=?, Price_per_kg=?, Image_URL=?
    WHERE Product_ID=?`;

  try {
    const [result] = await connection.query(sql, [
      p.Product_Name,
      p.Product_Source,
      p.Roast_Level,
      p.Size,
      p.Taste_Note,
      p.Price_per_kg,
      p.Image_URL,
      id
    ]);

    res.json({
      success: true,
      message: "Product updated!",
      result
    });

  } catch (err) {
    console.error("❌ UPDATE ERROR:", err.message);
    res.status(500).json(err);
  }
});

// method: PUT
// URL: http://localhost:5050/product/16
// Body (raw JSON)
// {"Product_Name": "Kenya Blend",
// "Product_Source": "Kenya",
// "Roast_Level": "L",
// "Size": "1kg",
// "Taste_Note": "Sweet and smooth",
// "Price_per_kg": 2000,
// "Image_URL": "https://i.pinimg.com/736x/01/f9/72/01f9728512f92813ebbac859baf4fe12.jpg"
// }

// ==========================
// Delete Product
// ==========================

app.delete('/product/:id', async (req, res) => {
  const id = req.params.id;

  const sql = "DELETE FROM Product WHERE Product_ID=?";

  try {
    const [result] = await connection.query(sql, [id]);
    res.json({
      success: true,
      message: "Product deleted!",
      result
    });

  } catch (err) {
    console.error("❌ DELETE ERROR:", err.message);
    res.status(500).json(err);
  }
});

// method: DELETE
// URL: http://localhost:3000/product/1

// ==========================
// CREATE USER
// ==========================

app.post("/api/users", async (req, res) => {
  const u = req.body;

  // Validation
  if (!u.First_Name || !u.Last_Name || !u.Username || !u.Password) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    // หา User_ID ล่าสุด (เช่น U001 → U006)
    const [rows] = await connection.query(`SELECT User_ID FROM User_Account ORDER BY User_ID DESC LIMIT 1`);
    let newId = "U001";

    if (rows.length > 0) {
      const last = parseInt(rows[0].User_ID.replace("U", ""));
      newId = "U" + String(last + 1).padStart(3, "0");
    }

    // INSERT USER
    const sql1 = `
      INSERT INTO User_Account 
      (User_ID, Username, Password, Create_Date, Date_of_Birth, First_Name, Last_Name, Address, Phone_Number, Role, Is_Active)
      VALUES (?, ?, ?, CURDATE(), ?, ?, ?, ?, ?, 'CUSTOMER', 1)`;

    const hashedPassword = await bcrypt.hash(u.Password, 10);

    await connection.query(sql1, [
      newId,
      u.Username,
      hashedPassword,
      u.Date_of_Birth,
      u.First_Name,
      u.Last_Name,
      u.Address,
      u.Phone_Number
    ]);

    // INSERT Email (optional)
    if (u.Email) {
      await connection.query(
        `INSERT INTO User_Email (User_ID, Email) VALUES (?, ?)`,
        [newId, u.Email]
      );
    }

    return res.json({
      success: true,
      message: "User created successfully!",
      User_ID: newId,
    });

  } catch (err) {
    console.error("❌ USER INSERT ERROR:", err);
    res.status(500).json({ success: false, message: err.sqlMessage });
  }
});
// ==========================
// GET USER BY ID 
// ==========================
app.get("/api/users/:id", async (req, res) => {
  try {
    const [rows] = await connection.query(
      `SELECT 
        u.User_ID,
        u.Username,
        u.First_Name,
        u.Last_Name,
        u.Address,
        u.Phone_Number,
        u.Role,
        u.Is_Active,
        u.Last_Login,
        u.Profile_Image,
        e.Email,
        u.Date_of_Birth
      FROM User_Account u
      LEFT JOIN User_Email e ON u.User_ID = e.User_ID
      WHERE u.User_ID = ?
      LIMIT 1`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ GET USER ID ERROR:", err);
    res.status(500).json({ message: "Database Error" });
  }
});

// ==========================
// UPDATE USER 
// ==========================
app.put("/api/users/:id", async (req, res) => {
  const id = req.params.id;
  const u = req.body;

  if (!u.First_Name || !u.Last_Name || !u.Username) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    const sql = `
      UPDATE User_Account
      SET First_Name=?, Last_Name=?, Date_of_Birth=?, Address=?, Phone_Number=?, Username=?
      WHERE User_ID=?
    `;

    await connection.query(sql, [
      u.First_Name,
      u.Last_Name,
      u.Date_of_Birth,
      u.Address,
      u.Phone_Number,
      u.Username,
      id
    ]);

    // UPDATE EMAIL
    if (u.Email) {
      await connection.query(
        `UPDATE User_Email SET Email=? WHERE User_ID=?`,
        [u.Email, id]
      );
    }

    // UPDATE PASSWORD (optional)
    if (u.Password && u.Password.trim() !== "") {
      const hashed = await bcrypt.hash(u.Password, 10);
      await connection.query(
        `UPDATE User_Account SET Password=? WHERE User_ID=?`,
        [hashed, id]
      );
    }

    return res.json({ success: true, message: "User updated successfully!" });

  } catch (err) {
    console.error("❌ UPDATE USER ERROR:", err);
    res.status(500).json({ success: false, message: err.sqlMessage });
  }
});

// ==========================
// DELETE USER
// ==========================
app.delete("/api/users/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await connection.query(`DELETE FROM User_Account WHERE User_ID=?`, [id]);
    await connection.query(`DELETE FROM User_Email WHERE User_ID=?`, [id]);

    res.json({
      success: true,
      message: "User deleted successfully!",
      User_ID: id,
    });

  } catch (err) {
    console.error("❌ USER DELETE ERROR:", err);
    res.status(500).json({ success: false, message: err.sqlMessage });
  }
});

// ==========================
// START SERVER
// ==========================
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});