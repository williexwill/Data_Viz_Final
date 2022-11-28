## Project Abstract
### Who’s Afraid of Big Government?: Exploring trends in Public Employment

A point of interest and research in my graduate studies has been the development, ownership, and governance of technology and technical systems. As part of that work I’ve been interested in the role of the state and public ownership of infrastructure, vs. the role of private profit-seeking interests. When reviewing the Census data I noticed that the economic data collected includes public employment numbers. Since I’m already interested in the interaction between public and private sectors, this data piqued my interest.
  
Using that employment data, I’d like to ask (and answer) this broad question: *Can we identify any trends by looking at public employment numbers broken down by state?*

Public employment numbers can be used as a proxy for the “size” of the state/government. They can provide a sense of what portion of the economy is under direct public oversight and management. Historically, at least rhetorically, Republicans have been associated with favoring “small government” (less regulation, less government intervention, investment, social services, etc.) whereas Democrats have been associated with a preference for “big government.” 

I opted to create some interactive tools that let the user examine public employment data in more detail, along with offering a window into other factors that may help illustrate teh political economy of each state individually. My project implements an interactive map that allows users to compare the data state-by-state. This is complemented by a bar graph ranking the states, as well as a toggleable scatter plot that allows for various comparisons to be made. 

Some of the factors that can be examined in relation to public employment rates are:
Total workforce (as an appropriate proxy for population)
Unemployment rates
GDP 
Political party affiliation/governance

The goal is to create a tool that offers an easy access point to granular public employment numbers. It will allow users to test or challenge their own assumptions about small vs. big government, and ideally serve as a grounding point to further research. 

## Final Sketches
![Image 1](https://github.com/williexwill/Data_Viz_Final/blob/master/sketches/Intro%20Map%20Page.png)
![Image 2](https://github.com/williexwill/Data_Viz_Final/blob/master/sketches/Percents%20Ranked.png)
![Image 3](https://github.com/williexwill/Data_Viz_Final/blob/master/sketches/public%20vs%20total%20workforce.png)

[Tableau Link](https://public.tableau.com/app/profile/will.luckman/viz/Tableau_Sketches/IntroMapPage#1)

## Proposed Site Architecture
### HTML and CSS

The HTML and CSS for this site will be fairly simple: I will style the page with a centered title and header text, with separate font styles for headers and body text. I will either create a single div or 3 separate divs (as needed) for my visualizations. 

### JavaScript and d3

I plan on creating 3 separate svg visualizations for this site. I am not yet sure if they will each need to be separate scripts or if I can manage to implement them in one script file for all.

Map: 
- Using GeoJSON data paired with coordinate data for US states, I will create a map 
- I will join the map with my census data assigning color attributes based on employment rates as a choropleth (if I’m feeling fancy, I may transition the color in on draw)
- I will use d3 (or possibly jQuery) to create pop-up tooltips on click.
- The map will not require a state change tied to data filtering.

Bar Chart:
- I will implement a bar chart with a filter that will change the state. 
- Color will be assigned by the governing party, it will be sorted from highest rate of public employment to lowest.
- The filter will show two different adjusted measures of public employment numbers.
- The transition will resort the data.

Scatterplot:
- I will implement a scatter plot with a filter that will change the state.
- The x-axis will remain static, but the y-axis will change and the points will be redrawn with each state change.

## Data Sources 

- [U.S. Census Data](https://data.census.gov/mdat/#/search?ds=ACSPUMS1Y2021&cv=COW&rv=ucgid&wt=PWGTP&g=0400000US01,02,04,05,06,08,09,10,11,12,13,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,44,45,46,47,48,49,50,51,53,54,55,56) I was able to find good data on public employment numbers, total employment numbers, and classification of workers by state. Unfortunately the other economic data I was looking for initially, on wages and poverty, proved much more difficult to work with on the state level.

- [Political Party Data](https://github.com/CivilServiceUSA/us-governors/blob/master/us-governors/data/us-governors.csv) There are many metrics by which to determine political affiliation, but since I was looking at state-level differences, I opted to go with the simple metric of the Governor’s party affiliation. In most states, the Governor as chief executive has great influence, if not ultimate authority, over state spending.    

- [State GDP Data](https://apps.bea.gov/regional/histdata/releases/0321gdpstate/index.cfm) The last full and reliable data from this report was 2019.

## Plan for Data Analysis
Pulling data tables and cuts from the above sources, I was able to [merge the data into a single dataset](https://github.com/williexwill/Data_Viz_Final/blob/master/data/Merged_Data.csv) using some basic Python techniques. 

To complete my Tableau sketches seen above I generated some new fields using calculated data. I may need to spend some more time in Python to replicate this work and generate a new data set…but on the other hand, the calculations are simple enough I may be able to incorporate them into my JS/d3 code. 
