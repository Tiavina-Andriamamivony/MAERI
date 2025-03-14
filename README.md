
# Website for [MAERI CONSULTING]

Welcome to the official website of **[MAERI CONSULTING]**, your trusted partner in supplying raw materials, pipes, and industrial equipment, as well as offering professional training tailored to the needs of small and medium enterprises (SMEs).

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This website was created for **[MAERI CONSULTING]**, a business specializing in the sale of raw materials, pipes, and various other equipment for SMEs. Additionally, the company offers professional training to help businesses improve their skills and expertise.

## Installation

### Prerequisites

- Node.js (version 14 or above)
- npm (or yarn)

### Installing the Project

1. Clone this repository to your local machine:
    ```bash
    git clone https://github.com/your-username/repository-name.git
    ```

2. Navigate to the project directory:
    ```bash
    cd repository-name
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```

4. Start the development server:
    ```bash
    npm run dev
    ```

5. Open your browser and access the application at [http://localhost:3000](http://localhost:3000).

## Technologies Used

- **Next.js**: A React framework for building static and dynamic websites.
- **React**: JavaScript library for building the user interface.
- **CSS/SCSS**: Used for layout and design of the website.
- **Node.js**: JavaScript runtime for the server-side.
- **Nodemailer**: Used for sending emails from the contact form.

## Project Structure

The project is organized as follows:

```
/pages
  /index.js         # Homepage
  /about.js         # About Us page
  /contact.js       # Contact page
  /services.js      # Services page
  /products.js      # Products page
  /trainings.js     # Trainings page

/components
  /Navbar.js        # Navigation bar component
  /Footer.js        # Footer component
  /HeroSection.js   # Hero section component
  /ServiceCard.js   # Card component for each service
  /ProductCard.js   # Card component for each product

/public
  /images           # Images used across the site

/styles
  /globals.css      # Global styles
  /home.module.css  # Styles specific to the homepage
```

## Contributing

If you'd like to contribute to this project, please follow these steps:

1. Fork this repository
2. Create a branch for your feature or bugfix (`git checkout -b feature/new-feature`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add a new feature'`)
5. Push your changes (`git push origin feature/new-feature`)
6. Open a pull request

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
