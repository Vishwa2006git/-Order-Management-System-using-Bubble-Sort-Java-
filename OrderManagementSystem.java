import java.util.Scanner;

/**
 * Project Title: Order Management System using Bubble Sort
 * Description: A menu-driven console application to manage customer orders.
 * Features: Insert, Display, Bubble Sort (O(n^2)), Linear Search (O(n)).
 * Author: vishwa462006@gmail.com
 */

// Class representing an Order entity
class Order {
    int orderId;
    String customerName;
    double amount;

    // Constructor to initialize Order attributes
    public Order(int orderId, String customerName, double amount) {
        this.orderId = orderId;
        this.customerName = customerName;
        this.amount = amount;
    }

    // Method to display order details in a formatted row
    public void display() {
        System.out.printf("| %-10d | %-20s | %-10.2f |\n", orderId, customerName, amount);
    }
}

public class OrderManagementSystem {
    private static Order[] orders = new Order[100]; // Array to store up to 100 records
    private static int orderCount = 0; // Counter for current number of orders
    private static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        int choice;

        System.out.println("==============================================");
        System.out.println("   WELCOME TO ORDER MANAGEMENT SYSTEM (DS)    ");
        System.out.println("==============================================");

        do {
            System.out.println("\n--- MENU ---");
            System.out.println("1. Insert Order");
            System.out.println("2. Display Orders");
            System.out.println("3. Sort Orders using Bubble Sort (by ID)");
            System.out.println("4. Search Order by ID (Linear Search)");
            System.out.println("5. Exit");
            System.out.print("Enter your choice: ");

            // Input validation for menu choice
            while (!scanner.hasNextInt()) {
                System.out.println("Error: Invalid input. Please enter a number (1-5).");
                scanner.next();
            }
            choice = scanner.nextInt();
            scanner.nextLine(); // Consume newline

            switch (choice) {
                case 1:
                    insertOrder();
                    break;
                case 2:
                    displayOrders();
                    break;
                case 3:
                    bubbleSort();
                    break;
                case 4:
                    searchOrder();
                    break;
                case 5:
                    System.out.println("Exiting System. Thank you!");
                    break;
                default:
                    System.out.println("Error: Invalid choice. Please try again.");
            }
        } while (choice != 5);
    }

    // Method to insert a new order record
    public static void insertOrder() {
        if (orderCount >= 100) {
            System.out.println("Error: System memory full. Cannot add more orders.");
            return;
        }

        System.out.print("Enter Order ID: ");
        while (!scanner.hasNextInt()) {
            System.out.println("Error: ID must be an integer.");
            scanner.next();
        }
        int id = scanner.nextInt();
        scanner.nextLine(); // Consume newline

        // Check for duplicate IDs
        for (int i = 0; i < orderCount; i++) {
            if (orders[i].orderId == id) {
                System.out.println("Error: Order ID " + id + " already exists.");
                return;
            }
        }

        System.out.print("Enter Customer Name: ");
        String name = scanner.nextLine();

        System.out.print("Enter Order Amount: ");
        while (!scanner.hasNextDouble()) {
            System.out.println("Error: Amount must be a decimal number.");
            scanner.next();
        }
        double amount = scanner.nextDouble();

        orders[orderCount++] = new Order(id, name, amount);
        System.out.println("Success: Order inserted successfully.");
    }

    // Method to display all orders in a tabular format
    public static void displayOrders() {
        if (orderCount == 0) {
            System.out.println("Info: No orders found in the system.");
            return;
        }

        System.out.println("\n+------------+----------------------+------------+");
        System.out.println("| Order ID   | Customer Name        | Amount     |");
        System.out.println("+------------+----------------------+------------+");
        for (int i = 0; i < orderCount; i++) {
            orders[i].display();
        }
        System.out.println("+------------+----------------------+------------+");
    }

    // Method to sort orders based on Order ID using Bubble Sort (O(n^2))
    public static void bubbleSort() {
        if (orderCount <= 1) {
            System.out.println("Info: Not enough records to sort.");
            return;
        }

        for (int i = 0; i < orderCount - 1; i++) {
            for (int j = 0; j < orderCount - i - 1; j++) {
                if (orders[j].orderId > orders[j + 1].orderId) {
                    // Swap orders[j] and orders[j+1]
                    Order temp = orders[j];
                    orders[j] = orders[j + 1];
                    orders[j + 1] = temp;
                }
            }
        }
        System.out.println("Success: Orders sorted by ID in ascending order.");
    }

    // Method to search for an order by ID using Linear Search (O(n))
    public static void searchOrder() {
        if (orderCount == 0) {
            System.out.println("Error: No orders to search.");
            return;
        }

        System.out.print("Enter Order ID to search: ");
        while (!scanner.hasNextInt()) {
            System.out.println("Error: ID must be an integer.");
            scanner.next();
        }
        int searchId = scanner.nextInt();

        boolean found = false;
        for (int i = 0; i < orderCount; i++) {
            if (orders[i].orderId == searchId) {
                System.out.println("Success: Order found!");
                System.out.println("+------------+----------------------+------------+");
                System.out.println("| Order ID   | Customer Name        | Amount     |");
                System.out.println("+------------+----------------------+------------+");
                orders[i].display();
                System.out.println("+------------+----------------------+------------+");
                found = true;
                break;
            }
        }

        if (!found) {
            System.out.println("Error: Order ID " + searchId + " not found.");
        }
    }
}
