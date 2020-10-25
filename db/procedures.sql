DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `employeeAddOrEdit`(
  IN _id INT,
  IN _name VARCHAR(45),
  IN _salary INT
)
BEGIN 

DECLARE affected_rows int;

  IF _id is null THEN
    INSERT INTO employee (name, salary)
    VALUES (_name, _salary);

    SET _id = LAST_INSERT_ID();
  ELSE
    UPDATE employee
    SET
    name = _name,
    salary = _salary
    WHERE id = _id;
  END IF;

	SET affected_rows = ROW_COUNT();
    
    if (affected_rows = 1) then
  -- SELECT _id AS 'id';
		SELECT * from employee where id = _id;
	else
		select 0 as id;
	end if;
END$$
DELIMITER ;
