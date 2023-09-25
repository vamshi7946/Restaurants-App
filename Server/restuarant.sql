CREATE TABLE Restaurants (
    RestaurantID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Address VARCHAR(255) NOT NULL,
    Phone VARCHAR(20),
    Website VARCHAR(255),
    Cuisine VARCHAR(255),
    Rating DECIMAL(3, 1),
    OpenHours VARCHAR(255),
    DeliveryOptions BOOLEAN
);
select * from Restaurants
INSERT INTO Restaurants (Name, Address, Phone, Website, Cuisine, Rating, OpenHours, DeliveryOptions)
VALUES
    ('Restaurant A', '123 Main St', '(555) 123-4567', 'http://www.restaurantA.com', 'Italian', 4.5, 'Monday-Friday: 10:00 AM - 10:00 PM', 1),
    ('Restaurant B', '456 Elm St', '(555) 987-6543', 'http://www.restaurantB.com', 'Mexican', 3.8, 'Tuesday-Saturday: 11:00 AM - 9:00 PM', 0);
