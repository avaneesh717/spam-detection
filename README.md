📱 Contact Management and Spam Detection System
🚀 Technologies Used

Frontend: ReactJS

Backend: NodeJS

Database: MySQL (via MySQL Workbench)

🧩 Overview
This project is a full stack web application that allows users to register, log in, manage personal contacts, and mark phone numbers as spam. It also includes a global database where all phone numbers (from both registered users and contacts) are stored and searchable.

🧠 Features
 Authentication and Personal Contacts

User Registration and Login

Users can register by entering their Name, Phone Number, Email, Password, City, and Country.

An OTP is sent to the user’s email for verification.

Only verified users can log in.

Personal Contact Management

Logged-in users can add personal contacts (name and phone number).

Each user can have zero or more contacts.

Contacts do not need to be registered users.

Each user can see only their own contact list.

 Global Database and Spam Marking

Global Database

Contains all registered users and all contacts added by users.

Displays phone numbers and their related details.

Spam Marking

Any user can mark a number as spam.

The number can be random it doesn’t have to belong to a registered user.

Spam Likelihood

Each number in the global database includes a Spam Likelihood value.

It is calculated based on how many times that number has been marked as spam across all users.

 Filter by Search

Search by Name

Users can search people by name in the global database.

Results include Name, Phone Number, and Spam Likelihood.

Results are ordered so that names starting with the search query appear first, followed by names that contain it.

Search by Phone Number

Users can also search by phone number.

Multiple names may appear for the same number (since different users may save it differently).

Detailed View

Clicking on a search result shows all details of that person.

Email is only shown if:

The person is a registered user and

The current user is in that person’s contact list.

🗂️ Data Stored

For each registered user:

Name

Phone Number

Email Address

Password (encrypted)

City and Country (optional)

For each personal contact:

Name

Phone Number

Linked to the user who added it

For the global database:

All user and contact phone numbers

Spam likelihood rating
