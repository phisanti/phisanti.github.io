---
title: "Building RMarkdown Reports from the CLI: A Tale of Persistence"
excerpt: "R, the good, the bad. I've learned that R shines brightest in three areas: statistical analysis, data visualization, and report generation."
collection: portfolio
---

# R, the Good, the Bad and the Ugly
I've learned that R shines brightest in three areas: statistical analysis, data visualization, and report generation. Data visualization with `ggplot2` is a form of art, crafting charts so beautiful that they could bring a tear to a data scientist's eye. Couple this with RMarkdown, and you have the undisputed champion for scientific reporting. It's the Swiss Army knife of reproducible research, seamlessly weaving together narrative, code, and results into a single, elegant document. It's the good, the beautiful, the stuff that makes you fall in love with data analysis.

But then there's the other side, the bad, the ugly. Trying to make R speak with the rest of the OS, like behaving like a proper CLI tool? That is theoretically possible, but why would you do that to yourself? R wasn't designed for this. It's a language built by statisticians for interactive exploration. However, I recently wrote some scripts that made some nice reports from a given dataset, and I found it a bit cumbersome to first write a new Rmd where I was just changing the name of the data path, and second, running:
```bash
Rscript -e "rmarkdown::render('./path/to/report', params=list(file='./data.csv'), output_file='report.pdf')"
```
was too ugly to bear. Thus, the challenge was born. I wanted to create an R package that, when my colleagues installed it, also installed a CLI tool to nicely assemble the automated reports.
# The CLI Challenge

The goal was simple: Create a tool where users could install the r package via `remotes::install_github('mypackage')`  and then run:

```bash
awesome_report --input data.csv --output report.pdf
```

However, the R's standard approach feels more like a workaround:
```bash
Rscript myscript.R
```
Then the classic shebang plus chmod approach:
```bash
# Add shebang to the script
#!/usr/bin/Rscript --vanilla


# Then give permissions
chmod +x awesome_report.R
```
Sure, it works on my machine™, but distributing this to colleagues? That's where the fun begins.

# The Plot Thickens
Enter the R packaging system. Surely someone must have solved this? The `cli` package looks promising. `Littler` catches your eye. Even the mighty Dirk Eddelbuettel (yes, that Dirk) says it's impossible. Here I quote from his (Stack Overflow answer)[https://stackoverflow.com/questions/44566100/installing-executable-scripts-with-r-package]:

>Short (and very sad) answer: You cannot. But read on.
>Reasoning: R will only ever write package content to its own .libPaths() directory (or the first in case several are given), or a directory given by the user.
>So, say, /usr/local/bin/ is simply out of reach. That is a defensible strategy.

Just when all hope seemed lost, like finding a bug in production code at 4:59 PM on a Friday, I stumbled upon (Rapp)[https://github.com/r-lib/Rapp]. Finally! They say in their intro page:

>Rapp (short for "R application") makes it fun to write and share command line applications in R.
>It is an alternative front end to R, a drop-in replacement for Rscript that does automatic handling of command line arguments. It converts a simple R script into a command line application with a rich and robust support for command line arguments.
>It aims to provides a seamless transition from interactive repl-driven development at the R console to non-interactive execution at the command line.

Just what I wanted... But wait - it still needs manual PATH setup?

# The Eureka Moment

The solution came together like connecting dots in a complex puzzle. First, while exploring Rapp's documentation, I found this gem:

> Place your app in the exec folder in your package, e.g: exec/myapp. Apps are automatically installed as executable.

Wait - automatic executable permissions? That solves the chmod headache!

Then, diving into R package development docs, I discovered the `configure` script - a hidden powerhouse that runs during package installation. Perfect timing to set up our PATH.

Finally, Rapp's own installation instructions provided the missing piece:

```bash
export PATH=$(Rscript -e 'cat(system.file("exec", package = "Rapp"))'):$PATH
export PATH=$(Rscript -e 'cat(system.file("exec", package = "my.package.name"))'):$PATH
```


Combining these three insights, here's the elegant solution:
```bash
#!/bin/bash

# Determine the user's shell configuration file
SHELL_RC="$(basename $SHELL)rc"
USER_RC="$HOME/.$SHELL_RC"

# Define color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'


# Add the exec directory of the package to the PATH
export PATH=$(Rscript -e "cat(system.file(\"exec\", package = \"mypackage\"))"):$PATH
EXPORT_CMD='export PATH=$(Rscript -e "cat(system.file(\"exec\", package = \"mypackage\"))"):$PATH'
if ! grep -Fxq "$EXPORT_CMD" "$USER_RC"; then
    echo "$EXPORT_CMD" >> "$USER_RC"
    # These echo messages are just to inform the users
    echo -e "${GREEN}Added mypackage exec directory to PATH in $USER_RC${NC}"
else
    echo -e "${YELLOW}mypackage exec directory already in PATH in $USER_RC${NC}"
fi
echo -e "${YELLOW}Please run 'source $USER_RC' before using the command.${NC}"
# Source the user's shell configuration file to apply changes
source "$USER_RC"
```
Place your R scripts in the exec/ folder, and the package installation handles everything else. Now users just need to open his R terminal and run:
```R
install.packages("mypackage")
# OR in my case
remotes::install_github('phisanti/BoeckLabRtools')
```
And voilà! PDF reports can be buil with.

```
mypackage build_report data.csv
```
Is it elegant? Maybe not. Does it work? Absolutely. Remember folks, in R, persistence pays off. And if someone tells you it can't be done, they probably just haven't found the right hack yet! If you're wondering why R makes CLI tools so complicated, remember it was created by statisticians, not programmers!