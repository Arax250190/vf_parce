create table if not exists vf_details
(
    id     int(15) auto_increment
        primary key,
    phone  varchar(15) null,
    sum    float       null,
    packet varchar(30) null,
    period date        null
);