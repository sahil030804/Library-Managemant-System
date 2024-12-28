const dueDateReminderTemplate = (name, bookTitle, dueDate) => `
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
            <h1>Reminder: Your Due Date is Approaching, ${name}!</h1>
        </div>
        <div class="content">
            <p>Dear ${name},</p>
            <p>We wanted to remind you that the book "<strong>${bookTitle}</strong>" is due on <strong>${dueDate}</strong>.</p>
            <p>Please ensure that you return the book by the due date to avoid any late fees or penalties. If you need more time, feel free to visit your account page to extend the due date, if applicable.</p>
            <a href="http://localhost:9090/api/books/borrowed" target="_blank">View Your Account</a>
        </div>
        <div class="footer">
            <p>&copy; 2024 Library Management System | All rights reserved</p>
        </div>
    </div>
</body>
</html>
`;

export default dueDateReminderTemplate;
