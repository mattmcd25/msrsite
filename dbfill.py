import pyodbc
import sys

def insertExperience(startCell, memdbid, emptyValues):
	bc = 0
	statement = 'INSERT INTO WORK("ID", "EMPLOYER", "LENGTH") OUTPUT Inserted.WORKID VALUES ('
	statement += "'" +memdbid + "', "
	if(i[startCell+2] in emptyValues):
		statement += "'N/A'"
		bc += 1
	else:
		statement += "'" + i[startCell+2] + "', "
		
	if(i[startCell+1] in emptyValues):
		statement += "'0'"
		bc += 1
	else:
		statement +=  i[startCell+1]
		
	if(bc <2):
		statement +=')'
		print(statement)
		cursor.execute(statement)
		cfa = cursor.fetchall();
		workdbid = str(cfa[0][0])
		print(cfa)
		print("workdib: " + workdbid)
		cnxn.commit()
		
	
		#INSERT SKILL
		statement = 'INSERT INTO WORK_SKILL("WORKID", "NAME") VALUES ('
		statement += "'" + workdbid + "', "
		statement += "'" + i[startCell] +"'"
		statement +=')'
		print(statement)
		cursor.execute(statement)
		cnxn.commit()
		
		
	elif(i[startCell] not in emptyValues):
		#HAS SKILL
		statement = 'INSERT INTO HAS_SKILL("ID", "NAME") VALUES ('
		statement += "'" + memdbid + "', "
		statement += "'" + i[startCell] +"'"
		statement +=')'
		print(statement)
		cursor.execute(statement)
		cnxn.commit()
		

def fillSkills(sheet):
	for ind,i in enumerate(sheet):
		if(ind == 0):
			continue
		try:
			statement = 'INSERT INTO SKILL("NAME", "DESC") VALUES (' + "'" + i[8] + "', 'None')"
			print(statement)
			cursor.execute(statement)
			cnxn.commit()
		except:
			print("NO")
		try:
			statement = 'INSERT INTO SKILL("NAME", "DESC") VALUES (' + "'" + i[11] + "', 'None')"
			cursor.execute(statement)
			cnxn.commit()
		except:
			print("NO")

#FILL SHEET WITH DATA FROM CSV
f = open(sys.argv[1]).read();
sheet = []
row = []
cell = ''
for i in f:
    if(i == ','):
        row.append(cell)
        cell = ''
    elif(i == '\n'):
        sheet.append(row)
        row = []
    elif(i != ',' and i != '\n'):
        cell = cell+i

print(len(sheet))


#CONNECT TO DB
dsn = 'den1.mssql4.gear.host'
user = 'msrtest'
password = 'msr2018!'
database = 'msrtest'
driver='SQLDriverConnect'

cnxn = pyodbc.connect('DRIVER={ODBC Driver 13 for SQL Server};SERVER='+dsn+';DATABASE='+database+';UID='+user+';PWD='+ password)
cursor = cnxn.cursor()

fillSkills(sheet)

emptyValues = ['n', 'N/A', '']
for index,i in enumerate(sheet):
	if(index == 0):
		continue
	name = i[2].split(' ')
	nlen = len(name)
	firstname = ''
	lastname = ''
	for ind,n in enumerate(name):
		if(ind == 0):
			firstname += n
		elif(ind<nlen-1):
			firstname += ' ' + n
		else:
			lastname = n
			
	memid = i[1].split('/')
	if(len(memid) == 4):
		d = memid[0] + '/' + memid[1]
		site = memid[2]
		mem = memid[3]
	else:
		d = 'none'
		site = 'no'
		mem = 'no'
		
	
	
	#INSERT MEMBER
	statement = 'INSERT INTO MEMBER("FIRSTNAME", "SURNAME", "MEMBERSHIP", "MOBILE", "ADDRESS", "MARITAL", "NATID", "SITE", "DATE", "DEPENDENTS") OUTPUT Inserted.ID VALUES ('
	statement += "'" + firstname + "', "
	statement += "'" + lastname + "', "
	statement += "'" + mem + "', "
	statement += "'" + i[4] + "', "
	statement += "'" + i[5] + "', "
	statement += "'" + i[6] + "', "
	statement += "'" + i[3] + "', "
	statement += "'" + site + "', "
	statement += "'" + d + "', "
	statement += "'" + i[7] + "'"
	statement +=')'
	print(statement)
	cursor.execute(statement)
	
	memdbid = str(cursor.fetchall()[0][0])
	print("memdib: " + memdbid) 
	cnxn.commit()
	insertExperience(8, memdbid, emptyValues)
	insertExperience(11, memdbid, emptyValues)
	
	if(i[14] == 'yes'):
		statement = 'INSERT INTO HAS_CERT("YEAR", "INSTITUTION", "TYPE", "ID") VALUES (' + "'0', 'N/A', 'Grade 10 Diploma', '" + memdbid + "')"
		print(statement)
		cursor.execute(statement)
		cnxn.commit()
		
		
	if(i[15] == 'yes'):
		statement = 'INSERT INTO HAS_CERT("YEAR", "INSTITUTION", "TYPE", "ID") VALUES (' + "'0', 'N/A', 'Grade 12 Diploma', '" + memdbid + "')" 
		print(statement)
		cursor.execute(statement)
		cnxn.commit()
		
		
	if(i[14] == 'yes'):
		statement = 'INSERT INTO HAS_CERT("YEAR", "INSTITUTION", "TYPE", "ID") VALUES (' + "'0', 'N/A', 'Generic Vocational Diploma', '" + memdbid + "')"
		print(statement)
		cursor.execute(statement)
		cnxn.commit()
		
	
	

