/*tested method for finding latitude and longitude for all restrooms in a range of latitude and longitudes
returns the list of tuples only containing the lat. and long. floats
mysql> Select latitude, longitude From restroom Where longitude <= 10.0 and longitude >= 0.0 and latitude <= 10.0 and latitude >= 0.0;
+----------+-----------+
| latitude | longitude |
+----------+-----------+
|        8 |         9 |
+----------+-----------+
1 row in set (0.00 sec)
*/
Select latitude, longitude From restroom Where longitude <= 10.0 and longitude >= 0.0 and latitude <= 10.0 and latitude >= 0.0;
/*tested method for inserting a new user into the users table*/
insert into users values(123, 'vulkan', 'collin', 'dobmeyer', 'password_1', 1, 3),(345, 'whizkid', 'chintan', 'patel', 'pssword_2', 1, 3);
/*tested method for inserting a new restroom into the restroom table
note the user_id is a foreign key thus the query will fail if no corresponding user is found*/
insert into restroom (user_id, avg_rating, latitude, longitude) values(123, 4.5, 30.000, 9.000), (345, 4.5, 8.000, 9.000);
/*tested method for inserting a response
Note that the first value is the response id which is auto incremented but the second part of the primary key the responds_to_id must be scanned from the php side to find the current maximum responds_to_id and increment the value before insertion to do this see COROLLARY*/
insert into response (responds_to_id, user_id, user_comments, gender, flags, thumbs_up, thumbs_down, time_stamp, review_star_rating, restroom_id) Values( 0 ,123, 'hello this is a comment', 1, 0, 0, 0, CURRENT_TIMESTAMP , 0, 1);
/*COROLLARY
this will return the list of all respondes_to_ids in desc order*/
select responds_to_id from response where review_id = 1 group by responds_to_id order by responds_to_id desc;
/**/

/**/

/**/

/**/

/**/

/**/
