const express = require("express");
const cors = require("cors");
const app = express();
const connection = require("./database");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();

require("dotenv").config();
console.log(`Hello ${process.env.Hello}`);

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

//customer
app.get("/", function (req, res) {
  const sql = "SELECT * FROM customers";
  connection.query(sql, function (err, results) {
    if (err) {
      console.log("Error connecting to DB");
    } else {
      res.send(results);
    }
  });
});

app.get("/search-customer/:customer_id", function (req, res) {
  const sql = "SELECT * FROM customers WHERE customer_id =?";
  const customer_id = req.params.customer_id;
  connection.query(sql, [customer_id], function (err, results) {
    if (err) {
      res.send({ status: false, message: "Customer search failed" });
    } else if (results) {
      res.send({ status: true, data: results });
    } else {
      res.send({ status: false, message: "Customer not found" });
    }
  });
});

app.post("/add-customer", function (req, res) {
  if (!req.body.first_name) {
    return res
      .status(404)
      .json({ success: false, error: "First name is not found" });
  }
  if (!req.body.last_name) {
    return res
      .status(404)
      .json({ success: false, error: "Last name is not found" });
  }
  if (!req.body.gender) {
    return res
      .status(404)
      .json({ success: false, error: "gender is not found" });
  }
  if (!req.body.email) {
    return res
      .status(404)
      .json({ success: false, error: "email is not found" });
  }
  if (!req.body.password) {
    return res
      .status(404)
      .json({ success: false, error: "Password is not found" });
  }

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  const data = {
    customer_id: req.body.customer_id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    gender: req.body.gender,
    email: req.body.email,
    password: req.body.password,
  };

  const sql = "INSERT INTO customers SET ?";
  connection.query(sql, data, function (err, results) {
    if (err) {
      res.send({ success: false, message: "Please try again later" });
    } else {
      res.send({ success: true, message: "Customer added successfully" });
    }
  });
});

app.delete("/delete-customer/:customer_id", function (req, res) {
  const customer_id = req.params.customer_id;
  const sql = "DELETE FROM customers WHERE customer_id = ?";
  connection.query(sql, [customer_id], function (err, results) {
    if (err) {
      res.send({ status: false, message: "Customer deletion failed" });
    } else if (results.affectedRows > 0) {
      res.send({ status: true, message: "Customer deleted successfully" });
    } else {
      res.send({ status: false, message: "Customer not found" });
    }
  });
});

app.put("/update-customer/:customer_id", function (req, res) {
  const customer_id = req.params.customer_id;
  const { first_name, last_name, gender, email, password } = req.body;
  const sql =
    "UPDATE customers SET first_name = ?, last_name = ?, gender = ?, email = ?, password = ? WHERE customer_id = ?";
  connection.query(
    sql,
    [first_name, last_name, gender, email, password, customer_id],
    function (err, results) {
      if (err) {
        res.send({ status: false, message: "Customer updation failed" });
      } else if (results.affectedRows > 0) {
        res.send({ status: true, message: "Customer updated successfully" });
      } else {
        res.send({ status: false, message: "Customer not found" });
      }
    }
  );
});

app.get("/get-customer-count", function (req, res) {
  const sql = "SELECT COUNT(*) AS customerCount FROM customers";
  connection.query(sql, function (err, results) {
    if (err) {
      res.send({ status: false, message: "Failed to get customer count" });
    } else {
      res.send({ status: true, customerCount: results[0].customerCount });
    }
  });
});

//contact
app.post("/add-contact", function (req, res) {
  const data = {
    contact_id: req.body.contact_id,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    subject: req.body.subject,
    message: req.body.message,
  };
  const sql = "INSERT INTO contacts SET ?";
  connection.query(sql, data, function (err, results) {
    if (err) {
      res.send({ success: false, message: "Please try again later" });
    } else {
      res.send({ success: true, message: "Message sent successfully" });
    }
  });
});

app.get("/contact-details", function (req, res) {
  const sql = "SELECT * FROM contacts";
  connection.query(sql, function (err, results) {
    if (err) {
      console.log("Error connecting to DB");
    } else {
      res.send(results);
    }
  });
});
app.delete("/delete-contact/:contact_id", function (req, res) {
  const contact_id = req.params.contact_id;
  const sql = "DELETE FROM contacts WHERE contact_id = ?";
  connection.query(sql, [contact_id], function (err, results) {
    if (err) {
      console.error("Error occurred:", err);
      res.send({ status: false, message: "Report deletion failed" });
    } else if (results.affectedRows > 0) {
      res.send({ status: true, message: "Report deleted successfully" });
    } else {
      res.send({ status: false, message: "Report not found" });
    }
  });
});

app.put("/update-contact/:contact_id", function (req, res) {
  const contact_id = req.params.contact_id;
  const { name, email, phone, subject, message } = req.body;
  const sql =
    "UPDATE contacts SET name = ?, email = ?,phone = ?,subject = ?,message = ? WHERE contact_id= ?";
  connection.query(
    sql,
    [name, email, phone, subject, message, contact_id],
    function (err, results) {
      if (err) {
        console.error("Error occurred:", err);
        res.send({ status: false, message: "contact updation failed" });
      } else if (results.affectedRows > 0) {
        res.send({ status: true, message: "contact updated successfully" });
      } else {
        res.send({ status: false, message: "contact not found" });
      }
    }
  );
});

app.get("/get-contact-count", function (req, res) {
  const sql = "SELECT COUNT(*) AS contactCount FROM contacts";
  connection.query(sql, function (err, results) {
    if (err) {
      res.send({ status: false, message: "Failed to get countact count" });
    } else {
      res.send({ status: true, contactCount: results[0].contactCount });
    }
  });
});

//booking
app.post("/add-booking", function (req, res) {
  const data = {
    booking_id: req.body.booking_id,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    number_of_rooms: req.body.number_of_rooms,
    arrival_date: req.body.arrival_date,
    number_of_guests: req.body.number_of_guests,
  };
  const sql = "INSERT INTO bookings SET ?";
  connection.query(sql, data, function (err, results) {
    if (err) {
      console.error("Error occurred:", err);
      res.send({ success: false, message: "Please try again later" });
    } else {
      res.send({ success: true, message: "Booking added successfully" });
    }
  });
});

app.get("/booking-details", function (req, res) {
  const sql = "SELECT * FROM bookings";
  connection.query(sql, function (err, results) {
    if (err) {
      console.log("Error connecting to DB");
    } else {
      res.send(results);
    }
  });
});

app.put("/update-booking/:booking_id", function (req, res) {
  const booking_id = req.params.booking_id;
  const {
    name,
    email,
    phone,
    number_of_rooms,
    number_of_guests,
    arrival_date,
  } = req.body;
  const sql =
    "UPDATE bookings SET name = ?, email = ?,phone = ?,number_of_rooms = ?,number_of_guests = ?,arrival_date = ? WHERE booking_id = ?";
  connection.query(
    sql,
    [
      name,
      email,
      phone,
      number_of_rooms,
      number_of_guests,
      arrival_date,
      booking_id,
    ],
    function (err, results) {
      if (err) {
        console.error("Error occurred:", err);
        res.send({ status: false, message: "Booking updation failed" });
      } else if (results.affectedRows > 0) {
        res.send({ status: true, message: "Booking updated successfully" });
      } else {
        res.send({ status: false, message: "Booking not found" });
      }
    }
  );
});

app.delete("/delete-booking/:booking_id", function (req, res) {
  const booking_id = req.params.booking_id;
  const sql = "DELETE FROM bookings WHERE booking_id = ?";
  connection.query(sql, [booking_id], function (err, results) {
    if (err) {
      console.error("Error occurred:", err);
      res.send({ status: false, message: "Booking deletion failed" });
    } else if (results.affectedRows > 0) {
      res.send({ status: true, message: "Booking deleted successfully" });
    } else {
      res.send({ status: false, message: "Booking not found" });
    }
  });
});

app.get("/get-booking-count", function (req, res) {
  const sql = "SELECT COUNT(*) AS bookingCount FROM bookings";
  connection.query(sql, function (err, results) {
    if (err) {
      res.send({ status: false, message: "Failed to get booking count" });
    } else {
      res.send({ status: true, bookingCount: results[0].bookingCount });
    }
  });
});

//login

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (email !== adminUser.email) {
    res.send({ status: false, message: "Invalid email" });
    return; 
  }
  const isMatch = await bcrypt.compare(password, adminUser.password);
  if (!isMatch) {
    res.send({ status: false, message: "Invalid password" });
    return; 
  }

  const payload = {
    user: {
      email: adminUser.email,
    },
  };

  jwt.sign(payload, "shafiya_123", { expiresIn: "1h" }, (err, token) => {
    if (err) {
      res.send({ status: false, message: "Error generating token" });
    } else {
      res.json({ token });
    }
  });
});

const adminUser = {
  email: "admin123@gmail.com",
   password:"$2a$10$ubs0sHvr0en/8WkJJLyc1e6Qjo7AWlh.xR9OZ4MjodXRD0rlcONRu", 
};

module.exports = router;

function authMiddleware(req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    res.send({ status: false, message: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, "shafiya_123");
    req.user = decoded.user;
    next();
  } catch (err) {
    res.send({ status: false, message: "Token is not valid" });
  }
}
app.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to the admin dashboard" });
});



const port = 3000;
app.listen(3000, function () {
  console.log("App Listening to port 3000 ");
});
