from imdb import imdb as api
import xml.etree.cElementTree as ET
import datetime
def registerSiteMaps(website_url:str,movie_list:list) -> None:
    root = ET.Element('urlset')
    root.attrib['xmlns:xsi']="http://www.w3.org/2001/XMLSchema-instance"
    root.attrib['xsi:schemaLocation']="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
    root.attrib['xmlns']="http://www.sitemaps.org/schemas/sitemap/0.9"
    for movie_title in movie_list:
        site_root = f'/{movie_title}'
        dt = datetime.datetime.now().strftime ("%Y-%m-%d")
        doc = ET.SubElement(root, "url")
        ET.SubElement(doc, "loc").text = website_url + site_root
        ET.SubElement(doc, "lastmod").text = dt
        ET.SubElement(doc, "changefreq").text = "weekly"
        ET.SubElement(doc, "priority").text = "0.8"
        tree = ET.ElementTree(root)
        tree.write('sitemap.xml', encoding='utf-8', xml_declaration=True)
header = {
"accept": "application/json",
"Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1N2JmOWVmZWMwZmM0MzcwMGQyYTc5YzE4YWI1OGZlZSIsIm5iZiI6MTcxOTgxNTQ5OS45MjIxMTgsInN1YiI6IjY1Y2YxMGQ5MzIyYjJiMDE3YzA2ZDM4YSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cM86_5kUPExBxFwuMQja0SKYc76wUoBcKjdf4_cRKrw"
}
url = 'https://streamify-io.netlify.app/'
db = api(header, params={'language': 'en', 'page':1})
data = db.fetch_movie_list(0)
print(data)
registerSiteMaps(url, data)
