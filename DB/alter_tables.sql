INSERT INTO public."User" (username,"password","role","createdAt","updatedAt",flags,"metaData") VALUES 
('cristi@dumitru.ro','$2a$10$5FY.0.qW2su9EcpU8T6F8O/bWDUELX4Y3y4OdCbFE57W4zhXeADYS',1,'2020-03-16 12:19:18.000','2020-03-16 12:19:18.000',1,'{}')
;
ALTER TABLE public."Answers" ALTER COLUMN survey_id TYPE text USING survey_id::text;
ALTER TABLE public."Answers" ALTER COLUMN consumer_id TYPE text USING consumer_id::text;
ALTER TABLE public."Answers" ALTER COLUMN answer TYPE text USING answer::text;

ALTER TABLE public."Surveys" ALTER COLUMN survey_desc TYPE text USING survey_desc::text;
ALTER TABLE public."Surveys" ALTER COLUMN survey_name TYPE varchar(255) USING survey_name::varchar;
ALTER TABLE public."Surveys" ALTER COLUMN form TYPE text USING form::text;

