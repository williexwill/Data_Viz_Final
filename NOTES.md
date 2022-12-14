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

I worked off these two tutorials and customized to my needs. 
https://leafletjs.com/examples/choropleth/
https://bost.ocks.org/mike/leaflet/ 

I also need to figure out how to merge my census data with GeoJson data.

First I found a tile layer I liked and set up a leaflet map in my "container 1" div. Later I'll add an svg on top of that map, that includes state outline paths, and color info based on employment numbers. 

The above method and leaflet/d3 integration got the best of me. Eventually I went ahead and built a functioning map, mostly using Leaflet, with minor d3 integrations. 

### Data merge
I have read in my csv and my geojson and stored both as arrays.

Now I need to figure out how to pull unemployment data ("WFUE") and add it to the proper JSON arrays, (ideally using the common 'Selected Geographies' and 'name' properties of each). 

(If I can't figure this out, maybe I'll think through ways to pull shape and color info separately)

I spent a while trying to figure this out, and go the point in my code where I was able to create a new data object that had the csv and GeoJSON data stored within it...and then I got stuck. 

Looking into .nest() to pull from each and create a new array... I tried making a nested forEach function to compare two different values from two different arrays and then create a new key:value pair in the first array...but I couldn't figure it out. I suspect part of the problem may have to do with my then() chaning and resolving promises...but I just couldn't wrap my head around it. 

In the end I manually created a new dataset, and I abandoned using d3 to make the assignments. Once I combine my separate scripts into a final page, I may reinvestigate.  

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

### What can be drawn or assigned initially and what needs to be adjusted by the filter
Intital:
- svg
- scales
- color

On Filter:
- dots
- axes
- tool tip (had these at init, but wasn't working)

Realized my proposed "filter" isn't filtering the data. What I'm actually asking the event selction to do is redraw the dots (new x and y) and redraw the x-axis, and incoprorate the proper scale....

That is to say, my data isn't changing but my join is changing. Maybe I can still work in some transitions here.

Maybe I can make an if/else function, set up each of the changes I want and tie them to the dropdown...maybe I can embbed the if/else within the data join.

I'm thinking it basically works like this:
- I read in the data on initialization
- I draw some initial elements
- there is a state change, based on dropdown selection
- the state change doesn't change the data, but it changes the draw function
    - specifically at the data join stage??

I got it to draw each graph on selection (no exit transistion yet). The only changes that I am making on the event are to:
- const xAxis
- xAxisGroup.append
    .text("")
- const circles
    .attr("cx")
I'm wondering if there is a way to isolate only these changes. Need to work out my transitions and maybe return to this...

### Transitions
I spent some time trying to figure out why my circles were clearing out each time I made a new selection, but my x axis kept stacking (I discoverd my tool tip layer was as well). What I realized was that as part of the data join I was selecting all "circle" elements and reassigning them to new data. 

Since the axes and tool tips aren't tied to the data in the same way, I added a step to the dropdown event that selects and removes them, by class, so they can be rewritten by the draw function. 

Now I need to figure out if I can add transitions into any of these steps...

I was able to add a transition to the x-axis remove fairly easily. However I am having a harder time adding transitions to the entering elements. 

When I add a transition to the x-axis .call, the select function is no longer able to grab/join/generate the circles. (error seems to be with me tring to append after text the transition...)

When I tried to add an enter function (never mind update/exit) to the circles, it fails to append any circles to the svg...(no error appearing, just circles aren't being appended...)

After office hours I realized I had some chaining issues. With a little trial and error I was able to rework the script and get everything functioning. 

There was only one issue I wasn't able to resolve. As part of the d3 bottomAxis method, the fill color on the x-axis was reassigned everytime it was drawn. I tried overriding this both the draw, and transition stages, and also directly on the css file, but I couldn't get it. As a result the x-axis appears a bit too dark.

### Legend
I spent a long time trying to figure out how to display my select element dropdown, floated in the proper position over my graph. I wasn't able to append it directly to to SVG and get it to appear. After a lot of trial and error I appended it to its own div within container3 like the tool tips and used z-indexing and dynamic placement instructions to move it and rescale it along with a rescaling window/underlying SVG. However, when I implemented auto-margins and centering, it affected the postioning in a way I wasn't able to resolve. Sometimes it displays corretly, but sometimes it loses its relative postion. 