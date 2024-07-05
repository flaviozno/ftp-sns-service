# 📁 FTP CSV Processor

Welcome to the FTP CSV Processor! This Node.js application is designed to automate the process of fetching CSV files from an FTP server, extracting specific data, and sending messages via AWS SNS. It ensures efficient handling of data and messaging, making your workflow smoother and more reliable.

## 🚀 Features

- **Automated FTP Access**: Connects to an FTP server and retrieves CSV files on an hourly basis.
- **Data Processing**: Extracts 'name' and 'phone' fields from the CSV file.
- **Database Integration**: Saves the extracted data into a database.
- **Phone Number Validation**: Validates phone numbers considering DDI, DDD, and overall validity.
- **AWS SNS Messaging**: Sends messages using Amazon SNS. Messages received after 8 PM are queued and sent the following morning.
- **Scheduled Execution**: Runs the entire process automatically every hour on Amazon Lambda.

## ⚙️ Configuration

- **Database Configuration**: Ensure your database is set up and the credentials in the .env file are correct.
- **AWS Configuration**: Ensure your AWS credentials and SNS Topic ARN are correctly configured in the .env file.

## 🤝 Contributing

Contributions are welcome! Please fork this repository and submit a pull request for any improvements or bug fixes.

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 💬 Feedback

If you have any feedback or questions, please open an issue on the GitHub repository or contact the maintainer.