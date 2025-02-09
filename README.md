# Let's Meet 🗓️

Let's Meet is a modern application for organizing and managing meetings. It allows users to create, search, and participate in events, as well as interact with other users. The app supports both free and paid events.

## 🚀 Technologies

- **Backend**: Python, Django
- **Database**: PostgreSQL
- **Map**: Leaflet.js
- **UI Framework**: Bootstrap
- **External APIs**:
  - 📍 **Geocoding API** – determining the location of events
  - 📧 **SendGrid API** – sending emails
  - 💳 **Stripe API** – handling payments
  - 🛡️ **Perspective API** – detecting toxic content (e.g., in comments)
- **Geographic Data**: django-cities-light

## ✨ Features

- ✅ **User registration and login**
- ✅ **Creating, editing, and deleting events**
- ✅ **Searching for events by name or price**
- ✅ **Displaying events on an interactive map**
- ✅ **User profile** (changing email, password, and username)
- ✅ **Commenting and rating events (1-5 stars)**
- ✅ **Sending messages between users**
- ✅ **Admin panel (ability to ban users)**
- ✅ **Joining and leaving events**
- ✅ **Payment handling for paid events**

## 🎯 Installation

1. **Clone the repository**:
   ```sh
   git clone https://github.com/your-username/lets-meet.git
   cd lets-meet

2. **Create and activate a virtual environment:**:
    ```sh
    python -m venv venv
    source venv/bin/activate  # Linux/macOS
    venv\Scripts\activate  # Windows

3. **Install dependencies:**:
    ```sh
   pip install -r requirements.txt

4. **Configure the database:**:
- Ensure PostgreSQL is installed and running.
- Set up the .env file with database access credentials.

5. **Apply migrations:**:
    ```sh
   python manage.py migrate

6. **Run the application:**:
    ```sh
   python manage.py runserver

## 🗺️ Event Map Preview

- The application uses Leaflet.js to visualize event locations on a map.

## 🧪 Testing

- The application is tested using Pytest to ensure stability and reliability.
- To run tests, use:
    ```sh
    pytest

## 📬 Contact

- Have questions? Want to report an issue? Get in touch with me! ✉️