-- ALTER SESSION SET CONTAINER = ORCLPDB1;
-- ALTER SESSION SET CONTAINER = XE;
ALTER SESSION SET CONTAINER = FREEPDB1;
ALTER SESSION SET CURRENT_SCHEMA = tno_user;

-- dropping the table and recreating it is faster than checking it and modifying it
drop table NEWS_ITEMS;

CREATE TABLE NEWS_ITEMS
(
  RSN NUMBER(38,0) NOT NULL ENABLE
, ITEM_DATE DATE
, SOURCE VARCHAR2(100 BYTE)
, ITEM_TIME DATE
, SUMMARY VARCHAR2(2000 BYTE)
, TITLE VARCHAR2(1000 BYTE)
, "TYPE" VARCHAR2(30 BYTE)
, FRONTPAGESTORY NUMBER(1,0)
, PUBLISHED NUMBER(1,0)
, "ARCHIVED" NUMBER(1,0)
, ARCHIVED_TO VARCHAR2(30 BYTE)
, RECORD_CREATED DATE
, RECORD_MODIFIED DATE
, STRING1 VARCHAR2(100 BYTE)
, STRING2 VARCHAR2(100 BYTE)
, STRING3 VARCHAR2(100 BYTE)
, STRING4 VARCHAR2(100 BYTE)
, STRING5 VARCHAR2(100 BYTE)
, STRING6 VARCHAR2(250 BYTE)
, STRING7 VARCHAR2(250 BYTE)
, STRING8 VARCHAR2(2000 BYTE)
, STRING9 VARCHAR2(2000 BYTE)
, NUMBER1 NUMBER(38,0)
, NUMBER2 NUMBER(38,0)
, DATE1 DATE
, DATE2 DATE
, FILENAME VARCHAR2(100 BYTE)
, FULLFILEPATH VARCHAR2(1000 BYTE)
, WEBPATH VARCHAR2(1000 BYTE)
, THISJUSTIN NUMBER(1,0)
, IMPORTEDFROM VARCHAR2(100 BYTE)
, EXPIRE_RULE NUMBER(38,0)
, COMMENTARY NUMBER(1,0)
, "TEXT" CLOB
, "BINARY" BLOB
, CONTENTTYPE VARCHAR2(20 BYTE)
, BINARYLOADED NUMBER(1,0)
, LOADBINARY NUMBER(1,0)
, EXTERNALBINARY NUMBER(1,0)
, CBRA_NONQSM NUMBER(1,0) DEFAULT 0
, POSTEDBY VARCHAR2(20 BYTE) DEFAULT ' '
, ONTICKER NUMBER(1,0) DEFAULT 0
, WAPTOPSTORY NUMBER(1,0) DEFAULT 0
, ALERT NUMBER(1,0) DEFAULT 0
, AUTO_TONE NUMBER(38,0)
, CATEGORIES_LOCKED NUMBER(1,0) DEFAULT 0
, CORE_ALERT NUMBER(1,0) DEFAULT 0
, COMMENTARY_TIMEOUT FLOAT DEFAULT 0
, COMMENTARY_EXPIRE_TIME NUMBER(38,0) DEFAULT 0
, TRANSCRIPT CLOB
, EOD_CATEGORY VARCHAR2(250 BYTE)
, EOD_CATEGORY_GROUP VARCHAR2(40 BYTE)
, EOD_DATE VARCHAR2(10 BYTE)
, CONSTRAINT NEWS_ITEMS_PK PRIMARY KEY
  (
    RSN
  )
  ENABLE
);
