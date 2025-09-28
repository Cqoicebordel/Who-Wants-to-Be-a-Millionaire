import csv
import json

# Name of the input file
csvfile = open('Untitledform.csv', 'r')
# Name of the output file
jsonfile = open('file.json', 'w')
# Name for the columns of the input file.
# pseudo : name of the author of the question
# disclose : does the author authorize showing their name
# q : question
# A, B, C, D : text of each answer
# r : right answer, as the letter of the proposed answer ["A", "B", "C", "D"]
fieldnames = ("pseudo","disclose","q", "A", "B", "C", "D", "r")

reader = csv.DictReader( csvfile, fieldnames)
out = '{"games": ['
i = 0
for row in reader:
    if(i % 15 == 0):
        out += '{"questions": ['
    
    out += '{'
    out += '"question": '+json.dumps(row["q"])+', '
    out += '"content": ['+json.dumps(row["A"])+','+json.dumps(row["B"])+' ,'+json.dumps(row["C"])+' ,'+json.dumps(row["D"])+'],'
    reponse = 0
    match row["r"]:
        case "B":
            reponse = 1
        case "C":
            reponse = 2
        case "D":
            reponse = 3
    out += '"correct": ' + str(reponse) +','
    out += '"pseudo": ' + json.dumps(row["pseudo"]) +','
    out += '"disclose": ' 
    out += "true" if (row["disclose"] == "Oui") else "false"
    out += '}'
    
    if(i % 15 == 14):
        out += ']},'
    else:
        out += ","
    
    i += 1

out = out[:-1]
out += ']}'
#print(out)
jsonfile.write(out)
