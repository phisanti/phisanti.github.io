# The following script is an adaptation from https://jonathanchang.org/blog/easily-showcase-your-google-scholar-metrics-in-jekyll/
# The goal of this variant is to extract the data from the Google Scholar page and store it in a YAML file


require 'open-uri'
require 'nokogiri'
require 'jekyll'

module Jekyll
  class ScholarStats < Generator
    # Replace `SCHOLAR_ID` with your own Google Scholar ID
    SCHOLAR_ID = '8UBe1NgAAAAJ'.freeze
    SCHOLAR_URL = 'https://scholar.google.com/citations?user='.freeze

    def generate(site)
      doc = Nokogiri::HTML(URI.parse(SCHOLAR_URL + SCHOLAR_ID).open)
      puts doc.css('title').text # Debugging output
      feed = doc.css('#gsc_a_b')
      if feed.empty?
        puts 'No publications found' # Debugging output
        return
      end
      tbl_data = { 'id' => SCHOLAR_ID }
      feed.css('tr')[1..].each do |tr|
        cell_data = tr.css('td').map(&:text)
        tbl_data[cell_data[0].downcase.sub('-', '_')] = cell_data[1].to_i
      end
        # Iterate over each row in the table
        feed.css('tr').each do |row|
            # Print the text content of each cell in the row
        row.css('td').each do |cell|
            print "#{cell.text} "
        end
            puts # Add a newline after each row
        end
        
      site.data['scholar'] = tbl_data
    end
  end
end

# Create a mock site object for testing purposes
site = Jekyll::Site.new(Jekyll.configuration)

# Create a new instance of ScholarStats and call its generate method
generator = Jekyll::ScholarStats.new
generator.generate(site)

# Print the value of site.data['scholar']
#puts site.data['scholar']