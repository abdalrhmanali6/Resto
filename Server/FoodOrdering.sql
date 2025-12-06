CREATE TABLE users
(
  id INT IDENTITY(1,1) PRIMARY KEY ,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL ,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  gender VARCHAR(20) CHECK (gender IN ('male', 'female')),
  birth_date DATE,
  phone VARCHAR(30) NOT NULL ,
  created_at SMALLDATETIME DEFAULT GETDATE()
)

CREATE TABLE roles
(
  id INT IDENTITY(1,1) PRIMARY KEY ,
  name VARCHAR(20) UNIQUE NOT NULL
)

CREATE TABLE user_roles (
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  PRIMARY KEY(user_id, role_id),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE ,
  FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE admins 
(
  user_id INT PRIMARY KEY ,
  date_employed DATE NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
)

CREATE TABLE delivery_profiles
(
  user_id INT PRIMARY KEY ,
  vehicle_type VARCHAR(50),
  license_plate VARCHAR(50),
  license_number VARCHAR(100),
  date_ready SMALLDATETIME , //////////////////////////////
  status VARCHAR(50) CHECK (status IN ('ready' , 'busy')),
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
)

CREATE TABLE orders
(
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT NOT NULL,
  delivery_id INT NOT NULL,
  location VARCHAR(200) NOT NULL,
  date_placed SMALLDATETIME DEFAULT GETDATE() NOT NULL,
  date_arrived SMALLDATETIME ,
  sub_total DECIMAL(10,2) NOT NULL,
  total_price AS (sub_total + delivery_fees) PERSISTED,
  delivery_fees DECIMAL(10,2) NOT NULL,
  status VARCHAR(25) NOT NULL CHECK (status IN ('preparing','ready','on_the_way','delivered')),///////////////////
  rating INT CHECK (rating BETWEEN 1 AND 5)
  --payment_type VARCHAR(25) CHECK (payment_type IN ('cash','credit_card','wallet')),
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(delivery_id) REFERENCES delivery_profiles(user_id)

  )

  CREATE TABLE categories (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
 );


  CREATE TABLE products
  (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name VARCHAR(50) NOT NULL unique,  //////////////////////////
  price DECIMAL(10,2) NOT NULL,
  description VARCHAR(MAX),
  image VARBINARY(MAX),
  category_id INT,
  FOREIGN KEY(category_id) REFERENCES categories(id)
  )

  create table order_item
  (
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  PRIMARY KEY (order_id, product_id),
  FOREIGN KEY(order_id) REFERENCES orders(id)ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(product_id) REFERENCES products(id)ON DELETE CASCADE ON UPDATE CASCADE
  )

  CREATE TABLE cart (
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  PRIMARY KEY(user_id, product_id),
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(product_id) REFERENCES products(id)
);


