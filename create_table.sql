create table vf_details
(
    id             int(15) auto_increment
        primary key,
    phone          varchar(15) null,
    packet         varchar(30) null,
    packPrice      float       null,
    discount       float       null,
    overPack       float       null,
    roaming        float       null,
    contentService float       null,
    sum            float       null,
    period         date        null
);


