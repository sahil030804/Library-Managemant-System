const registrationTemplate = (name) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Successful</title>
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
            background-color: #1a73e8;
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
            background-color: #1a73e8;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 25px;
            border-radius: 5px;
            font-weight: bold;
            margin-top: 20px;
            text-align: center;
        }
        .content a:hover {
            background-color: #0c63e4;
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
            <h1>Welcome, ${name}!</h1>
        </div>
        <div class="content">
            <p>We are thrilled to have you as part of our community! Your registration is successful, and you can now enjoy all the benefits of our Library Management System.</p>
            <p>If you have any questions or need assistance, feel free to reach out to us.</p>
            <p>We look forward to providing you with a seamless experience.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Library Management System | All rights reserved</p>
        </div>
    </div>
</body>
</html>
`;

export default registrationTemplate;
