const dueDateReminderTemplate = ({ username, books }) =>
  `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Library Due Date Reminder</title>
      <style>
          body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f9f9f9;
          }
          .email-container {
              max-width: 650px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          }
          .header {
              background-color: #f57c00;
              color: #ffffff;
              padding: 30px;
              text-align: center;
          }
          .header h1 {
              margin: 0;
              font-size: 28px;
          }
          .content {
              padding: 30px;
              color: #333333;
              font-size: 16px;
              line-height: 1.6;
          }
          .content p {
              margin-bottom: 20px;
          }
          table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
          }
          table th {
              background-color: #f57c00;
              color: #ffffff;
              padding: 12px;
              text-align: left;
          }
          table td {
              padding: 10px;
              border: 1px solid #e0e0e0;
              font-size: 15px;
              color: #333333;
          }
          table tr:nth-child(even) {
              background-color: #f9f9f9;
          }
          .content a {
              display: inline-block;
              background-color: #f57c00;
              color: #ffffff;
              text-decoration: none;
              padding: 12px 25px;
              border-radius: 5px;
              font-weight: bold;
              margin-top: 20px;
              text-align: center;
          }
          .content a:hover {
              background-color: #e65100;
          }
          .footer {
              background-color: #f1f1f1;
              text-align: center;
              padding: 15px;
              font-size: 14px;
              color: #777777;
          }
          .footer p {
              margin: 0;
          }
      </style>
  </head>
  <body>
      <div class="email-container">
          <div class="header">
              <h1>Reminder: Books Due Soon, ${username}!</h1>
          </div>
          <div class="content">
              <p>Dear ${username},</p>
              <p>We wanted to remind you of the due dates for the following books:</p>
              <table>
                  <tr>
                      <th>Book Title</th>
                      <th>Due Date</th>
                  </tr>
                  ${books
                    .map(
                      (book) => `
                  <tr>
                      <td>${book.title}</td>
                      <td>${book.dueDate}</td>
                  </tr>`
                    )
                    .join("")}
              </table>
              <p>Please ensure that you return the books by their due dates to avoid any late fees or penalties. If you need more time, feel free to visit your account page to extend the due dates, if applicable.</p>
              <a href="http://localhost:9090/api/books/borrowed" target="_blank">View Your Account</a>
          </div>
          <div class="footer">
              <p>&copy; 2025 Library Management System | All rights reserved</p>
          </div>
      </div>
  </body>
  </html>
    `;

export default dueDateReminderTemplate;
