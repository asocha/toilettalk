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
/*tested method for inserting a new user into the users table
NOTE: the user id is now set to auto increment*/
insert into users (username, first_name, last_name, password, gender, permission) values('vulkan', 'collin', 'dobmeyer', 'password_1', 1, 3),('whizkid', 'chintan', 'patel', 'pssword_2', 1, 3);
/*tested method for inserting a new restroom into the restroom table
note the user_id is a foreign key thus the query will fail if no corresponding user is found*/
insert into restroom (user_id, avg_rating, latitude, longitude) values(123, 4.5, 30.000, 9.000), (345, 4.5, 8.000, 9.000);
/*tested method for inserting a response
Note that the first value is the response id which is auto incremented but the second part of the primary key the responds_to_id must be scanned from the php side to find the current maximum responds_to_id and increment the value before insertion to do this see COROLLARY*/
insert into response (responds_to_id, user_id, user_comments, gender, flags, thumbs_up, thumbs_down, time_stamp, review_star_rating, restroom_id) Values( 0 ,123, 'hello this is a comment', 1, 0, 0, 0, CURRENT_TIMESTAMP , 0, 1);
/*COROLLARY
this will return the list of all respondes_to_ids in desc order*/
select responds_to_id from response where review_id = 1 group by responds_to_id order by responds_to_id desc;
/*tested query for incrementing the thumbs up value use thumbs_down=thumbs_down-1 for negative feedback*/
update response set thumbs_up=thumbs_up+1 where review_id = 1 AND responds_to_id = 0;
/*tested query for inserting a route into the routes table note that primary key route id is auto_incremented*/
insert into routes(user_id, origin, destination) values (123, '7369 Maryland ave. 63130', '5555 E mockingbird ln 75206');
/*inserts a rr associated with a route into the joining table*/
insert into restrooms_for_route(route_id, restroom_id) values(1, 1);
/*retrieves the information of all restrooms associated with a route*/
select re.avg_rating, re.latitude, re.longitude from restroom re, restrooms_for_route rfr, routes ro where re.restroom_id = rfr.restroom_id and rfr.route_id = ro.route_id and ro.user_id =123 and ro.route_id=1;

/**/

/**/
