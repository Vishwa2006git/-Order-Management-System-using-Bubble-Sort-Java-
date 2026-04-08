# Order Management System

A Java-based order management system that efficiently stores, sorts, and searches customer orders using the Bubble Sort algorithm.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Algorithm Implementation](#algorithm-implementation)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

##  Overview

This Order Management System is designed to handle customer orders with efficient sorting and searching capabilities. The system uses the **Bubble Sort algorithm** to maintain sorted order records, enabling quick data retrieval and organized record management.

##  Features

- **Order Storage**: Store customer orders with details (Order ID, Customer Name, Order Date, Amount, Status)
- **Bubble Sort Implementation**: Efficiently sort orders by various criteria
- **Search Functionality**: Search orders by ID, customer name, or other attributes
- **Multiple Sort Options**: Sort by Order ID, Amount, Date, or Customer Name
- **Display Records**: View all orders in a formatted table
- **CRUD Operations**: Create, Read, Update, and Delete order records
- **Data Validation**: Input validation for order details
- **Console-based Interface**: Simple command-line interface for easy interaction

##  Technologies Used

- **Language**: Java (JDK 8 or higher)
- **Data Structures**: Arrays, Custom Objects
- **Algorithm**: Bubble Sort
- **I/O**: Scanner for user input, System.out for output

##  System Requirements

- Java Development Kit (JDK) 8 or higher
- Any Java IDE (Eclipse, IntelliJ IDEA, NetBeans) or text editor
- Command line/terminal access
- Minimum 512 MB RAM
- 50 MB free disk space

##  Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/order-management-system.git
   cd order-management-system
   ```

2. **Navigate to the source directory**
   ```bash
   cd src
   ```

3. **Compile the Java files**
   ```bash
   javac *.java
   ```

4. **Run the application**
   ```bash
   java Main
   ```

##  Usage

### Running the Application

```bash
java Main
```

### Main Menu Options

```
===== Order Management System =====
1. Add New Order
2. Display All Orders
3. Sort Orders by ID
4. Sort Orders by Amount
5. Sort Orders by Date
6. Search Order by ID
7. Search Orders by Customer Name
8. Update Order
9. Delete Order
0. Exit
```

### Sample Workflow

1. **Add Orders**: Enter order details when prompted
2. **Sort Orders**: Choose sorting criteria (ID, Amount, Date)
3. **Search Orders**: Find specific orders by ID or customer name
4. **Display**: View all orders in sorted format
5. **Update/Delete**: Modify or remove orders as needed

##  Project Structure

```
order-management-system/
│
├── src/
│   ├── Main.java                 # Entry point of the application
│   ├── Order.java                # Order model class
│   ├── OrderManager.java         # Core business logic
│   ├── BubbleSort.java          # Bubble sort implementation
│   └── SearchUtility.java       # Search operations
│
├── docs/
│   └── documentation.md         # Detailed documentation
│
├── README.md                    # This file
└── LICENSE                      # License information
```

##  Algorithm Implementation

### Bubble Sort

The system implements **Bubble Sort** for organizing order records. While not the most efficient for large datasets, it's chosen for:

- **Simplicity**: Easy to understand and implement
- **In-place sorting**: Minimal memory overhead
- **Stability**: Maintains relative order of equal elements
- **Educational value**: Demonstrates fundamental sorting concepts

**Time Complexity**:
- Best Case: O(n) - when array is already sorted
- Average Case: O(n²)
- Worst Case: O(n²)

**Space Complexity**: O(1) - in-place sorting

### Example Code Snippet

```java
public void bubbleSortByAmount(Order[] orders, int count) {
    for (int i = 0; i < count - 1; i++) {
        for (int j = 0; j < count - i - 1; j++) {
            if (orders[j].getAmount() > orders[j + 1].getAmount()) {
                // Swap
                Order temp = orders[j];
                orders[j] = orders[j + 1];
                orders[j + 1] = temp;
            }
        }
    }
}
```

##  Examples

### Adding an Order

```
Enter Order ID: 101
Enter Customer Name: Vishwa Mohan
Enter Order Date (DD-MM-YYYY): 15-03-2024
Enter Order Amount: 1500.50
Enter Order Status (Pending/Processing/Delivered): Processing

✓ Order added successfully!
```

### Displaying Orders

```
Order ID | Customer Name    | Date       | Amount    | Status
---------|------------------|------------|-----------|------------
101      | John Doe         | 15-03-2024 | 1500.50   | Processing
102      | Jane Smith       | 16-03-2024 | 2300.00   | Pending
103      | Bob Johnson      | 17-03-2024 | 890.75    | Delivered
```

### Searching Orders

```
Enter Order ID to search: 102

Order Found:
Order ID: 102
Customer: Jane Smith
Date: 16-03-2024
Amount: $2300.00
Status: Pending
```

##  Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature/improvement`)
6. Create a Pull Request

### Coding Standards

- Follow Java naming conventions
- Add comments for complex logic
- Write clean, readable code
- Test thoroughly before submitting

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Authors

- Your Name - Initial work - [YourGitHub](https://github.com/Vishwa2006git)

##  Acknowledgments

- Inspired by real-world order management requirements
- Educational demonstration of sorting algorithms
- Thanks to the Java community for best practices

##  Contact

For questions or support, please contact:
- Email: your.vishwa462006@gmail.com
- GitHub Issues: [Create an issue](https://github.com/vishwa2006git/order-management-system/issues)

##  Future Enhancements

- [ ] Implement more efficient sorting algorithms (Quick Sort, Merge Sort)
- [ ] Add database integration (MySQL/PostgreSQL)
- [ ] Create GUI using JavaFX or Swing
- [ ] Export orders to CSV/PDF
- [ ] Add order analytics and reporting
- [ ] Implement user authentication
- [ ] Add email notifications
- [ ] RESTful API integration


**Note**: This is an educational project demonstrating sorting algorithms. For production systems handling large datasets, consider using more efficient sorting algorithms like Quick Sort or built-in Java Collections.sort().

**Star ⭐ this repository if you find it helpful!**
