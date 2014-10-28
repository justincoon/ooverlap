drop table if exists users;
drop table if exists address;


create table users (
  uid SERIAL,
  fname varchar(50),
  lname varchar(50),
  email varchar(50),
  password varchar(25),
  primary key (uid)
  );

create table schedule (
	aid SERIAL,
	day varchar(100),
	year varchar(50),
	title varchar(50),
	description varchar(150),
 	starTime TIME(),
	endTime TIME(),
--	uid int,
	primary key (aid)
FOREIGN KEY (uid) REFERENCES users(uid)
);


insert into users values (1, 'John', 'Doe', 'xxxx', 27);
insert into users values (2, 'Jane', 'Doe', 'yyyy', 28);
insert into users values (3, 'Bill', 'Flood', 'aaaa', 29);
insert into users values (4, 'Veb', 'Nordhagen', 'bbbb', 30);
insert into users values (5, 'Hazel', 'Nutting', 'cccc', 4);
insert into users values (6, 'Caleb', 'Manu', 'dddd', 7);
insert into users values (7, 'Aiden', 'Hall', 'eeee', 19);

insert into address values (1, '1 mallard drive', 'cambridge', 'MA', '34567');
insert into address values (2, '21 jump street', 'new york', 'NY', '98765');
insert into address values (3, '4 cherry lane', 'truffala', 'NJ', '58235');
insert into address values (4, '16 strong road', 'chutney', 'VT', '38573');
insert into address values (5, '99 livingston circle', 'amherst', 'MA', '99822');
insert into address values (6, '1123 main street', 'worcester', 'MA', '22234');

insert into lives values
	(1, 6),
	(2, 4),
	(3, 6),
	(4, 2),
	(5, 5),
	(6, 1),
	(7, 3);

