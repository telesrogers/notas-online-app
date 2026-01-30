# Online Grades App 🎓

React Native APP developed as part of the **Mobile Application Architecture** course, from the **Distributed Software Architecture** postgraduate program at **PUC Minas**.

---

## ✨ Features

Mobile application developed using React Native, integrated with the [notas-online-api](https://github.com/telesrogers/notas-online-api) for student grade management. The application supports the creation, retrieval, and updating of academic records.

### Functionalities
- 🔐 **JWT Authentication**: Secure login for Administrators and Teachers.
- 🏫 **School Management**: Registration and maintenance of institution data.
- 👨‍🏫 **Teacher Management**: Linking teachers to schools and subjects.
- 👨‍🎓 **Student Management**: Complete control of academic records.
- 📚 **Subject Management**: Configuration of subjects with personalized approval criteria.
- 📊 **Grade System**: Grade posting with automatic calculation of averages and status (Approved, Recovery, Failed).

### Screens
- **Home/Dashboard**: System overview.
- **Login/Register**: Access and account creation.
- **Students**: Listing and CRUD of students.
- **Teachers**: Listing and CRUD of teachers.
- **Subjects**: Management of subjects and workloads.
- **Grades**: Posting and visualization of academic performance.
- **Tests**: Dedicated screen for service validation and integration.

---

## 🚀 Technologies

The project uses the following technologies and libraries:

- **React Native** & **Expo**: Main framework for cross-platform development.
- **TypeScript**: Static typing for greater safety and productivity.
- **Tamagui**: UI framework for styled and responsive components.
- **Axios**: HTTP client for consuming the Notas Online API.
- **Expo Router**: File-based navigation.
- **Lucide Icons**: Vector icon set.
- **React Navigation**: Stack and tab navigation management.

---

## 📊 Data Structure

The main entities of the system are:

- **User**: Represents users (Admin/Teacher) with access to the system.
- **School**: Educational institution to which all other data is linked.
- **Teacher**: Professionals responsible for the subjects.
- **Student**: Enrolled students.
- **Subject**: Subjects that have average criteria and links to teachers.
- **Grade**: Record of student grades, containing assessment history and final average.

---

## ⚙️ How to Run

### Prerequisites

Before you begin, you will need to have installed:
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) on your phone or a configured emulator (Android/iOS)

### Step by Step

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure API**
   Copy the `.env.example` file to `.env` and configure the API URL:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env`:
   ```env
   EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
   # For Android Emulator use: http://10.0.2.2:3000
   ```

3. **Start the app**
   ```bash
   npx expo start
   ```

---

## 📂 Project Structure

The folder organization follows the modern Expo pattern:

- `app/`: Contains the application routes and screens (Expo Router).
  - `(app)/`: Screens protected by authentication.
  - `auth/`: Login and registration screens.
- `assets/`: Static resources such as images and fonts.
- `components/`: Reusable React components.
- `constants/`: Theme, color, and constant value configurations.
- `hooks/`: Custom hooks for shared logic.
- `src/`: Core application logic.
  - `services/`: API calls and service logic.
  - `types/`: TypeScript interfaces and types.
  - `contexts/`: Global state providers (e.g., AuthContext).
  - `storage/`: Local data persistence (Token Storage).
- `scripts/`: Auxiliary development scripts.