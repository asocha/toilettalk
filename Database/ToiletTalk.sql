drop database ToiletTalk;
create database ToiletTalk;
SET storage_engine=INNODB;
use ToiletTalk;
create table users(user_id INT, username VARCHAR(16), first_name VARCHAR(16), last_name VARCHAR(16), password VARCHAR(120), gender TINYINT(1), permission INT, PRIMARY KEY(user_id));

create table response(review_id INT NOT NULL AUTO_INCREMENT, responds_to_id INT NOT NULL, user_id INT, user_comments VARCHAR(400), gender TINYINT(1), flags INT, thumbs_up INT, thumbs_down INT, time_stamp TIMESTAMP, review_star_rating INT, restroom_id INT, PRIMARY KEY(review_id, responds_to_id), FOREIGN KEY(user_id) REFERENCES users(user_id));

create table icons(review_id INT UNIQUE NOT NULL, diaper_changing_station TINYINT(1), handicap_accessible TINYINT(1), unisex TINYINT(1), customer_only TINYINT(1), 24_hour TINYINT(1), PRIMARY KEY(review_id), FOREIGN KEY(review_id) REFERENCES response(review_id));

create table restroom(restroom_id INT AUTO_INCREMENT, user_id INT, avg_rating FLOAT, latitude FLOAT, longitude FLOAT, PRIMARY KEY(restroom_id), FOREIGN KEY(user_id) REFERENCES users(user_id));
ALTER TABLE response add foreign key(restroom_id) references restroom(restroom_id);

create table routes(route_id INT UNIQUE NOT NULL, user_id INT, origin VARCHAR(200), destination VARCHAR(200), PRIMARY KEY(route_id), FOREIGN KEY (user_id) REFERENCES users(user_id));

create table restrooms_for_route(route_id INT, restroom_id INT, PRIMARY KEY(route_id, restroom_id), FOREIGN KEY(route_id) REFERENCES routes(route_id), FOREIGN KEY(restroom_id) REFERENCES restroom(restroom_id));
 
create table saved_restrooms(restroom_id INT, user_id INT, PRIMARY KEY(restroom_id, user_id), FOREIGN KEY(restroom_id) REFERENCES restroom(restroom_id), FOREIGN KEY(user_id) REFERENCES users(user_id));

create table developers(apiKey INT PRIMARY KEY, first_name varchar(80), last_name varchar(80), emailAddress Varchar(80));

insert into users values(123, 'vulkan', 'collin', 'dobmeyer', 'password_1', 1, 3),(345, 'whizkid', 'chintan', 'patel', 'pssword_2', 1, 3);
insert into restroom (user_id, avg_rating, latitude, longitude) values(123, 4.5, 30.000, 9.000), (345, 4.5, 8.000, 9.000);
insert into response (responds_to_id, user_id, user_comments, gender, flags, thumbs_up, thumbs_down, time_stamp, review_star_rating, restroom_id) Values( 0 ,123, 'hello this is a comment', 1, 0, 0, 0, CURRENT_TIMESTAMP , 0, 1);
