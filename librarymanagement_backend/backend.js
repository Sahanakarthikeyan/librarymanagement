//curl -X GET http://localhost:3000/books
const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
const { Pool } = require('pg');
const QRCode = require('qrcode'); 
const app = express();
const port = 3000;

// PostgreSQL connection setup
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database:'libraryManagement',
  password: 'Sahana@2004',
  port: 5432,
});

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database:'libraryManagement',
  password: 'Sahana@2004',
  port: 5432,
});

client.connect()
.then(() => {
  console.log('Connected to PostgreSQL database successfully!');
})
.catch((error) => {
  console.error('Failed to connect to PostgreSQL database:', error.stack);
  process.exit(1); // Exit the process if connection fails
});


// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Enable JSON parsing

// API Endpoint to get all books
app.get('/books', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM book');
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send('Error retrieving books');
  }
});

// API Endpoint to get book by name
app.get('/books/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const result = await client.query('SELECT * FROM book WHERE "book_name" = $1', [name]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Book not found');
    }
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send('Error retrieving book');
  }
});

app.delete('/deletebook/:id', async (req, res) => {
  try {
    const  identity  = parseInt(req.params.id,10);
    const result = await client.query('DELETE FROM book WHERE "book_id" = $1', [identity]);
    if (result.rowCount > 0) {
      res.json({ message: 'Book deleted successfully' });
    } else {
      res.status(404).send('Book not found');
    }
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send('Error deleting book');
  }
});
app.delete('/deletecust/:id', async (req, res) => {
  try {
    const identity = req.params.id;
    const result = await client.query('DELETE FROM "customer" WHERE "cust_id" = $1', [identity]);
    if (result.rowCount > 0) {
      res.json({ message: 'Customer deleted successfully' });
    } else {
      res.status(404).send('Customer not found');
    }
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send('Error deleting Customer');
  }
});


app.get('/authors', async (req, res) => {
  try {
    const result = await client.query('SELECT DISTINCT "author" FROM book');
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send('Error retrieving Authors');
  }
});

app.get('/authors/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const result = await client.query('SELECT * FROM book WHERE "author" = $1', [name]);
    if (result.rows.length > 0) {
      res.json(result.rows);
    } 
    else
     {
      res.status(404).send('Book not found');
    }
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send('Error retrieving book');
  }
});



app.get('/customers', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM "customer"');
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send('Error retrieving books');
  }
});

app.get('/customers/:id', async (req, res) => {
  try {
    const  identity  = parseInt(req.params.id);
    const result = await client.query('SELECT * FROM "customer" WHERE "cust_id" = $1 ', [identity]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Customer not found');
    }
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send('Error retrieving book');
  }
});

app.get('/lent', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM book WHERE "indicator" = $1', ['red']);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send('Error retrieving Authors');
  }
});

app.put('/return/:id', async (req, res) => {
  const bookId = req.params.id;
  const currentDate = new Date();
  const formattedCurrentDate = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format

  try {
    const result = await client.query(
      'UPDATE book SET "indicator" = $1, "current_status" = $2, "return_date" = $3 WHERE "book_id" = $4',
      ['green', 'Available',formattedCurrentDate, bookId]
    );
    res.status(200).send('Book returned successfully');
  } catch (error) {
    res.status(500).send(error.message);
  }
});



app.get('/return', async (req, res) => {
  try {
    
    const result = await client.query('SELECT * FROM book WHERE "indicator" = $1 and "last_borrower" != $2 ', ['green','No Last Borrower']);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send('Error retrieving Authors');
  }
});

app.get('/test', (req, res) => {
  res.send('Test endpoint is working');
});

// app.post('/postbooks', (req, res) => {
//   const { bookName, author, price, purchaseDate, boughtFrom, bookType, identity } = req.body;

//   client.query(
//     'INSERT INTO book ("book_name", "author", "price", "Date_of_purchase", "bought_from", "current_status", "book_type", "Id","indicator") VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9) RETURNING *',
//     [bookName, author, price, purchaseDate, boughtFrom, "Available" , bookType, identity,"green"],
//     (error, results) => {
//       if (error) {
//         console.error('Error executing query', error.stack);
//         return res.status(500).json({ error: 'An error occurred while adding the book' });
//       }
//       res.status(201).json({ message: 'Book added successfully', book: results.rows[0] });
//     }
//   );
// });


app.post('/postbooks', async (req, res) => {
  const { bookName, author, price, purchaseDate, boughtFrom, bookType, identity ,genre,isbn} = req.body;

  // Generate QR code data
  const qrData = JSON.stringify({
    bookName,
    author,
    price,
    purchaseDate,
    boughtFrom,
    currentStatus: 'Available',
    bookType,
    identity,
    genre,
    isbn
  });

  // Generate QR code
  QRCode.toDataURL(qrData, async (err, url) => {
    if (err) {
      console.error('Error generating QR code', err);
      return res.status(500).json({ error: 'An error occurred while generating the QR code' });
    }

    try {
      // Insert book details along with the QR code URL into the database
      const result = await client.query(
        'INSERT INTO book ("book_name", "author", "price", "date_of_purchase", "bought_from", "current_status", "book_type", "book_id","genre","isbn", "indicator", "qrcode") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
        [bookName, author, price, purchaseDate, boughtFrom, 'Available', bookType, identity,genre,isbn, 'green', url]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      if (error.code === '23505') { // Unique violation error code for PostgreSQL
        res.status(400).send({ error: 'ID already used' });
      } else {
        console.error('Error inserting Book:', error); // Log the error for debugging
        res.status(500).send({ error: 'Internal Server Error' });
      }
    }
  });
});

// app.post('/postcust', async (req, res) => {
//   const { Fname, Lname, Mobile, Email, Address, Id, joinDate} = req.body;
//   try {
//       // Assuming you're using a PostgreSQL client like pg
//       await client.query('INSERT INTO public."Customer" ("cust_fname", "cust_lname", "Mobile", "Email", "Address", "cust_id", "Join_Date") VALUES ($1, $2, $3, $4, $5, $6, $7)', 
//       [Fname, Lname, Mobile, Email, Address, Id,joinDate]);
//       res.status(201).send({ message: 'Customer added successfully' });
//   } catch (error) { 
//       if (error.code === '23505') { // Unique violation error code for PostgreSQL
//           res.status(400).send({ error: 'ID already used' });
//       } else {
//         console.error('Error inserting customer:', error); // Log the error for debugging
//         res.status(500).send({ error: 'Internal Server Error' })          
//       }
//   }
// });


app.post('/postcust', async (req, res) => {
  const { Fname, Lname, Mobile, Email, Street, City, Id, joinDate } = req.body;

  // Combine Street and City into an array
  const Address = [Street, City];

  try {
    await client.query(
      'INSERT INTO public."customer" ("cust_fname", "cust_lname", "mobile", "email", "address", "cust_id", "join_date") VALUES ($1, $2, $3, $4, $5, $6, $7)', 
      [Fname, Lname, Mobile, Email, Address, Id, joinDate]
    );

    res.status(201).send({ message: 'Customer added successfully' });
  } catch (error) {
    if (error.code === '23505') { // Unique violation error code for PostgreSQL
      res.status(400).send({ error: 'ID already used' });
    } else {
      console.error('Error inserting customer:', error); // Log the error for debugging
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }
});



// Endpoint to update book color and other details
app.put('/booksUpdateColor/:id/:cust/:custid', (req, res) => {
  const currentDate = new Date();
  const formattedCurrentDate = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format
  const futureDate = new Date(currentDate);
  futureDate.setDate(currentDate.getDate() + 14);
  const formattedFutureDate = futureDate.toISOString().split('T')[0]; // YYYY-MM-DD format

  const identity = parseInt(req.params.id, 10);
  const custName = req.params.cust;
  const custId = req.params.custid;

  // Log incoming parameters
  // console.log(Received parameters - ID: ${identity}, Customer Name: ${custName}, Customer ID: ${custId}, Lend Date: ${formattedCurrentDate}, Return Date: ${formattedFutureDate});

  if (isNaN(identity) || isNaN(custId)) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }

  client.query(
    'UPDATE book SET "indicator" = $1, "last_borrower" = $2, "cust_id" = $3, "date_Of_lending" = $4, "return_date" = $5,  "current_status"= $6 WHERE "book_id" = $7',
    ["red", custName, custId, formattedCurrentDate, formattedFutureDate,"Lent", identity],
    (error, results) => {
      if (error) {
        console.error(`Error updating book with ID ${identity}: ${error.message}`);
        res.status(500).json(`{ error: Error updating book: ${error.message} }`);
      } else if (results.rowCount === 0) {
        res.status(404).json(`{ error: Book with ID ${identity} not found }`);
      } else {
        res.status(200).json(`{ message: Book with ID ${identity} updated successfully }`);
      }
    }
  );
});

app.put('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { bookName, author, price, purchaseDate, boughtFrom, bookType, identity,genre,isbn } = req.body;
  
  client.query(
    'UPDATE book SET "book_name" = $1, "author" = $2, "price" = $3, "date_of_purchase" = $4, "bought_from" = $5, "book_type" = $6, "indicator" = $7,"genre"=$8 ,"isbn"=$9 WHERE "book_id" = $10  RETURNING *',
    [bookName, author, price, purchaseDate, boughtFrom, bookType, "green", genre, isbn, id],
    (error, results) => {
      if (error) {
        res.status(500).send(`Error updating book with ID ${id}: ${error.message}`);
      } else {
        res.status(200).json(results.rows[0]);      }
    }
  );
});

// app.put('/cust/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const { Fname, Lname, Mobile, Email,Street,City , Id ,joinDate} = req.body;
//   const Address=[Street,City];
//   client.query(
//     'UPDATE "Customer" SET "cust_fname" = $1, "cust_lname" = $2, "Mobile" = $3, "Email" = $4, "Address" = $5, "Join_Date"=$6 WHERE "cust_id" = $7 RETURNING *',
//     [Fname, Lname, Mobile, Email,Address, Id,joinDate],
//     (error, results) => {
//       if (error) {
//         res.status(500).send(`Error updating customer with ID ${id}: ${error.message}`);
//       } else {
//         res.status(200).json(results.rows[0]);
//       }
//     }
//   );
// });


// app.put('/cust/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const { Fname, Lname, Mobile, Email, Street, City, Id, joinDate } = req.body; 
//   // Concatenate the street and city to form a single address string
//   const Address = `${Street}, ${City}`;
//   const formattedCurrentDate = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD format
//   client.query(
//     'UPDATE "Customer" SET "cust_fname" = $1, "cust_lname" = $2, "Mobile" = $3, "Email" = $4, "Address" = $5, "Join_Date" = $6 WHERE "cust_id" = $7 RETURNING *',
//     [Fname, Lname, Mobile, Email, Address, formattedCurrentDate, Id],
//     (error, results) => {
//       if (error) {
//         res.status(500).send(`Error updating customer with ID ${id}: ${error.message}`);
//       } else {
//         res.status(200).json(results.rows[0]);
//       }
//     }
//   );
// });


app.put('/cust/:id', (req, res) => {
  console.log('Request Body:', req.body); // Add this
  console.log('Request Params:', req.params); // Add this
  const id = parseInt(req.params.id);
  const { Fname, Lname, Mobile, Email, Street, City, Id, joinDate } = req.body;
  const Address = [Street,City];

  client.query(
    'UPDATE "customer" SET "cust_fname" = $1, "cust_lname" = $2, "mobile" = $3, "email" = $4, "address" = $5, "join_date" = $6 WHERE "cust_id" = $7 RETURNING *',
    [Fname, Lname, Mobile, Email, Address, joinDate, Id],
    (error, results) => {
      if (error) {
        console.error(`Error updating customer: ${error.message}`); // Add this
        res.status(500).send(`Error updating customer: ${error.message}`);
      } else {
        res.status(200).json(results.rows[0]);
      }
    }
  );
});


app.get('/custName/:custId', async (req, res) => {
  try {
    const identity = parseInt(req.params.custId);
    console.log(identity);
    const result = await client.query('SELECT * FROM "customer" WHERE "cust_id" = $1', [identity]);
   
    if (result.rows.length == 0) {
      
      res.json(null);
      
    }
    else{
      res.json(result.rows); // Sending all rows as an array
    }
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send('Error retrieving books');
  }
});


// Endpoint to fetch book by ID
app.get('/books/:id', async (req, res) => {
  const { identity } = parseInt(req.params.id);
  console.log(identity);

  try {
    const result = await client.query('SELECT * FROM book WHERE "book_id" = $1', [identity]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.error('Error fetching book by ID:', error);
    res.status(500).json({ error: 'An error occurred while fetching the book' });
  }
});



app.get('/books/:id/qrcode', async (req, res) => {
  const bookId = req.params.id;
  
  // You would typically fetch book details by ID here.
  // For simplicity, we use a static URL.
  const qrData = `http://localhost:3000/books/${bookId}`;
  
  try {
    const qrCodeUrl = await QRCode.toDataURL(qrData);
    res.send(qrCodeUrl);
  } catch (err) {
    console.error('Error generating QR code', err);
    res.status(500).send('Error generating QR code');
  }
});




// Define API route for fetching reports
app.get('/api/report', async (req, res) => {
  const {book_id, cust_id, status, notification_type, transaction_status } = req.query;

  try {
    const result = await client.query(
      'SELECT * FROM combined_notification_transaction_detail($1, $2, $3, $4, $5) ',
      [
        book_id || null,
        cust_id || null,
        status || null,
        notification_type || null,
        transaction_status || null,
      ]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send('Server error');
  }
});



// Route to fetch distinct notification statuses
app.get('/api/distinct-customer-ids', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT cust_id FROM transaction order by cust_id');
    res.json(result.rows.map(row => row.cust_id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching customer IDs' });
  }
});

app.get('/api/distinct-book-ids', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT book_id FROM transaction order by book_id');
    res.json(result.rows.map(row => row.book_id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching book IDs' });
  }
});
//---------------------------------------
app.get('/api/distinct-messages', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT message FROM notification');
    res.json(result.rows.map(row => row.msg));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching messages' });
  }
});
app.get('/api/distinct-notification-date', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT notification_date FROM notification');
    res.json(result.rows.map(row => row.ndate));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching notification dates' });
  }
});

app.get('/api/distinct-link', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT action_link FROM notification');
    res.json(result.rows.map(row => row.link));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching action link' });
  }
});
app.get('/api/distinct-transaction-ids', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT transaction_id FROM transaction order by transaction_id');
    res.json(result.rows.map(row => row.trans_id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching transaction IDs' });
  }
});

app.get('/api/distinct-lending-date', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT lending_date FROM transaction');
    res.json(result.rows.map(row => row.ldate));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching lending dates' });
  }
});

app.get('/api/distinct-due', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT due_amount FROM transaction order by due_amount');
    res.json(result.rows.map(row => row.due));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching due amounts' });
  }
});

//-----------------------------------------
app.get('/api/distinct-notification-status', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT status FROM notification');
    res.json(result.rows.map(row => row.status));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching notification statuses' });
  }
});

// Route to fetch distinct notification types
app.get('/api/distinct-notification-type', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT type FROM notification');
    res.json(result.rows.map(row => row.type));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching notification types' });
  }
});

// Route to fetch distinct transaction statuses
app.get('/api/distinct-transaction-status', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT status FROM transaction');
    res.json(result.rows.map(row => row.status));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching transaction statuses' });
  }
});


app.get('/api/total-counts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM notification WHERE status = 'Read') AS totalread,
        (SELECT COUNT(*) FROM notification WHERE status = 'Unread') AS totalunread,
        (SELECT COUNT(*) FROM notification WHERE type = 'Payment Confirmation') AS totalpaymentconfirmation,
        (SELECT COUNT(*) FROM notification WHERE type = 'Payment Due') AS totalpaymentdue,
        (SELECT COUNT(*) FROM transaction WHERE status = 'Paid') AS totalpaid,
        (SELECT COUNT(*) FROM transaction WHERE status = 'Not Paid') AS totalnotpaid,
        (SELECT COUNT(*) FROM customer) AS totalcustomers;

    `);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching total counts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
const validColumns = ['transaction_id', 'cust_id', 'due_amount'];

app.get('/api/reports', async (req, res) => {
  try {
    let { custId, status, notificationType, transactionStatus, sortBy, order } = req.query;

    let query = `SELECT * FROM combined_notification_transaction_detail() WHERE 1=1`;

    if (custId) {
      query += ` AND cust_id = '${custId}'`;
    }
    if (status) {
      query += ` AND notification_status = '${status}'`;
    }
    if (notificationType) {
      query += ` AND notification_type = '${notificationType}'`;
    }
    if (transactionStatus) {
      query += ` AND transaction_status = '${transactionStatus}'`;
    }

    if (!validColumns.includes(sortBy)) {
      return res.status(400).json({ error: 'Invalid sorting column' });
    }

    order = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${sortBy} ${order}`;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//--------------------------------------------------------------------------------------------------------
// GET Report Data with Limit**
app.get('/api/getReportData', async (req, res) => {
  const maxRows = parseInt(req.query.maxRows) || 5; // Default 5 rows
  try {
      const result = await pool.query(`SELECT * FROM your_table_name LIMIT $1;`, [maxRows]);
      res.json(result.rows);
  } catch (error) {
      console.error('Error fetching report data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});



//-------------------------------------------------------------------
// Example API route
// app.get('/api/get-column-values', (req, res) => {
//   // Fetch unique values from different columns
//   const columnValues = {
//     customerIds: getUniqueValues('cust_id'),
//     notificationStatuses: getUniqueValues('notification_status'),
//     notificationTypes: getUniqueValues('notification_type'),
//     transactionStatuses: getUniqueValues('transaction_status'),
//   };
//   res.json(columnValues);
// });
app.get('/api/get-column-values', async (req, res) => {
  try {
    const columns = [
      'cust_id',
      'book_id',
      'message',
      'notification_date',
      'notification_status',
      'notification_type',
      'action_link',
      'transaction_id',
      'lending_date',
      'due_amount',
      'transaction_status',
    ];

    let columnValues = {};

    for (let column of columns) {
      const result = await pool.query(`SELECT DISTINCT ${column} FROM reports`);
      columnValues[column] = result.rows.map((row) => row[column]);
    }

    res.json(columnValues);
  } catch (error) {
    console.error('Error fetching column values:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

