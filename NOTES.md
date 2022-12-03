## Grouped data
I haven't done much data grouping or calculating thus far, but some groups/calculations would be beneficial. I may decide to go back and do this using python, but maybe I can work it into my script. For now, just keeping track of those categories/calculations I need to create:

- Total Workforce ("TWF") = ("Total ES" - "Not in Labor Force" - "N/A (less than 16 years old)")
- Total Public Workforce ("TPWF") = ("Local government employee (city, county, etc.)" + "State government employee" + "Federal government employee")
- Total Non-Federal Workforce ("TNFWF") = ("Local government employee (city, county, etc.)" + "State government employee")
- Percent of Workforce Unemployed ("WFUE") = ("Unemployed" / "TWF")

Setting up these two evne though I may use scripts to calculate these dynamically:
- Public Employee Percent of Workforce ("PEPW") = ("TPWF" / "TWF")
- Non-Federal Public Employee Percent of Workforce ("NFPW") = ("TNFWF" / "TWF")

Decided to add these calcualtions to my dataset in python. 
https://colab.research.google.com/drive/1BqUQ0jE1PWRWO23uX35q47HKRLoAIN_S?usp=sharing 

## Map
I have some experience with Leaflet mapping, so I'm going to try to incoproate that with my data and some d3 implementation. 

https://leafletjs.com/examples/choropleth/
https://bost.ocks.org/mike/leaflet/
http://techslides.com/convert-csv-to-json-in-javascript 
http://zweibel.net/javascripting-masters-student/workshop/Javascript/?page=9 

I also need to figure out how to merge my census data with GeoJson data. 

## Scatter plot
As I was working through this, I realized I should have both dynamic x and y axis. For the y axis I'm thinking a filter for level of state employment (federal, state, local), and the x axes will be relevant economic data (total workforce, GDP, unemployment, wages).

That means not much of the svg will be permanent. I will condsider leaving the y axis static and drawing that at initialization, using the uppermost percent of *all* public workers as the domain. I think that will provide some visual consistency and allow for easier comparisons. 

### Axes information
Y axis:
    yScale (linear)
    domain = 0 -> max percent all public employment ("PEPW")

I'm not sure whether to set this up y values as a simple toggle:
- All public employees %
    y = (state+local+federal)/total workforce ("PEPW")

- Non-federal public employee %
    y = (state+local)/toal workforce ("NFPW")

Or if I can figure out a filter that can generate y values that are a sum  based on selecting 3 different variables...

X axis:
- Total Workforce
    x = "TWF"
    xScale1 (linear)
        domain = 0 -> max TWF

- GDP
    x = GDP ("GDP_2019_In_Mil")
    xScale1 (linear)
        domain = 0 -> max GDP

- Unemployment
    x = "WFUE"
    xScale1 (linear)
        domain = 0 -> max WFUE

- Wages
    x = wages ("Wages or salary income past 12 months (use ADJINC to adjust WAGP to constant dollars)")
    xScale1 (linear)
        domain = 0 -> max wages