create table providers
(
    id       smallint(6) auto_increment
        primary key,
    provider varchar(255) not null
);

create table invoice
(
    id            smallint(6) auto_increment
        primary key,
    provider_id   smallint(6)  null,
    paymentPeriod date         null,
    fileName      varchar(100) null,
    constraint FK_invoice
        foreign key (provider_id) references providers (id)
);

create table invoiceSummary
(
    id               smallint(6) auto_increment
        primary key,
    deptLastMouth    float       not null,
    deptCurrentMouth float       not null,
    invoice_id       smallint(6) not null,
    constraint FK_invoiceSummary_invoice_id
        foreign key (invoice_id) references invoice (id)
);

create table phones
(
    id           smallint(6) auto_increment
        primary key,
    phoneNumber  varchar(30)  null,
    openNumber   date         null,
    closedNumber date         null,
    provider_id  smallint(6)  null,
    description  varchar(255) null,
    constraint FK_phones_providers_id
        foreign key (provider_id) references providers (id)
);

create table contractMonth
(
    id           smallint(6) auto_increment
        primary key,
    packet       varchar(40) null,
    price        float       null,
    userPhone_id smallint(6) null,
    invoice_id   smallint(6) null,
    sum          float       null,
    constraint FK_contractMonth_invoice_id
        foreign key (invoice_id) references invoice (id),
    constraint FK_contractMonth_phones_id
        foreign key (userPhone_id) references phones (id)
);

create table services
(
    id          smallint(6) auto_increment
        primary key,
    serviceName varchar(100) null
);

create table serviceMonth
(
    id             smallint(6) auto_increment
        primary key,
    userPhone_id   smallint(6) null,
    serviceName_id smallint(6) null,
    invoice_id     smallint(6) null,
    sum            float       null,
    constraint FK_serviceMonth_phones_id
        foreign key (userPhone_id) references phones (id),
    constraint FK_serviceMonth_services_id
        foreign key (serviceName_id) references services (id),
    constraint FK_services_invoice_id
        foreign key (invoice_id) references invoice (id)
);

create table users
(
    id   smallint(6) auto_increment
        primary key,
    name varchar(50) not null
);

create table phoneOwner
(
    id        smallint(6) auto_increment
        primary key,
    phone_id  smallint(6) null,
    user_id   smallint(6) null,
    date_from date        null,
    date_to   date        null,
    constraint FK_phoneOwner_phones_id
        foreign key (phone_id) references phones (id),
    constraint FK_phoneOwner_users_id
        foreign key (user_id) references users (id)
);


