# BankValidatorApp

A modern, professional web application for validating Nigerian bank account details in real-time with 99.9% accuracy. Built with React and Vite, this application provides both single account validation and batch processing capabilities.

![Bank Validator App](https://bankvalidatorapp.vercel.app/og-image.png)

## 🌟 Features

- **Single Account Validation**: Verify individual bank accounts instantly
- **Smart Validation**: Automatically detect the correct bank from 25+ priority Nigerian banks
- **Batch Processing**: Upload CSV files to validate up to 50 accounts simultaneously
- **Real-time Results**: Get instant feedback with detailed validation status
- **Export Functionality**: Download batch validation results as CSV
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Bank Code Reference**: Access comprehensive list of all supported Nigerian bank codes

## 🚀 Live Demo

Visit the live application: [https://bankvalidatorapp.vercel.app/](https://bankvalidatorapp.vercel.app/)

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- API token from [NUBAPI](https://nubapi.com)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/successdanesy/bank-validator.git
cd bank-validator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_TOKEN=your_api_token_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build
```

The optimized production files will be generated in the `dist` directory.

## 🎯 Usage

### Single Account Validation

1. Navigate to the "Single Validation" tab
2. Enter a 10-digit Nigerian bank account number
3. Either:
   - Select a specific bank from the dropdown, OR
   - Click "Smart Validate" to auto-detect the bank
4. View instant validation results

### Batch Processing

1. Navigate to the "Batch Processing" tab
2. Prepare a CSV file with the following format:
   ```
   Account Number,Institution Code
   1234567890,000015
   0987654321,000014
   ```
3. Upload your CSV file (maximum 50 rows)
4. Monitor real-time processing progress
5. Download results as CSV when complete

### Bank Codes Reference

- Click "Bank Institution Code Reference" to view all supported banks
- Search functionality to quickly find specific banks
- Use these codes for batch CSV uploads

## 🏗️ Project Structure

```
bank-validator/
├── public/
│   ├── table-sample.png
│   └── og-image.png
├── src/
│   ├── pages/
│   │   ├── validator.jsx
│   │   └── bankvalues.jsx
│   ├── banks.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🔧 Technologies Used

- **React 19** - Frontend framework
- **Vite** - Build tool and development server
- **React Router DOM** - Client-side routing
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **NUBAPI** - Bank account verification API

## 🌐 API Integration

This application uses the [NUBAPI](https://nubapi.com) service for bank account verification. The API provides:

- Real-time account validation
- Support for all major Nigerian banks
- High accuracy rate (99.9%)
- Fast response times (average 2 seconds)

## 📝 CSV Format Guidelines

For batch processing, ensure your CSV file follows these guidelines:

- **Column 1**: Account Number (10 digits)
- **Column 2**: Institution Code (6 digits)
- **Maximum rows**: 50 per upload
- **Header row**: Required
- **No special characters** in account numbers

Example:
```csv
Account Number,Institution Code
1234567890,000015
0987654321,000014
5555555555,000003
```

## 🎨 Key Features Breakdown

### Smart Validation
Automatically checks your account number against 25+ priority Nigerian banks, including:
- Zenith Bank
- Access Bank
- GTBank
- First Bank
- UBA
- And more...

### Batch Processing
- Process up to 50 accounts in one upload
- Real-time progress tracking
- Detailed success/failure reporting
- Export results for record-keeping

### Mobile Responsive
- Optimized touch interfaces
- Collapsible mobile menu
- Responsive tables and forms
- Touch-friendly buttons

## 🔒 Security

- API tokens stored in environment variables
- No sensitive data stored in browser
- Secure HTTPS connections to API
- Input validation and sanitization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

**Success Chukwuemeka**

- Email: [successdanesy@gmail.com](mailto:successdanesy@gmail.com)
- LinkedIn: [success-chu](https://www.linkedin.com/in/success-chu)
- GitHub: [@successdanesy](https://github.com/successdanesy)
- WhatsApp: [+234 708 819 3394](https://wa.me/2347088193394)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [NUBAPI](https://nubapi.com) for providing the bank verification API
- [Tailwind CSS](https://tailwindcss.com) for the styling framework
- [Lucide](https://lucide.dev) for the beautiful icons
- All contributors and users of this application

## 📊 Performance Metrics

- ⚡ **Average validation time**: 2 seconds
- 📊 **Batch capacity**: 50 accounts per upload
- 🎯 **Accuracy rate**: 99.9%
- 🏦 **Supported banks**: 100+ Nigerian banks

---

Made with ❤️ by Success Chukwuemeka
