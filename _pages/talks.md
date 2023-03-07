---
layout: archive
title: "Talks and presentations"
permalink: /talks/
author_profile: true
---

# 2021 NECS (Newcastle, Edinburgh, Cambridge Sheffield) Research day
Here is a [link](../files/scm_LMBsymposium2020.pdf) to my talk to the Newcastle, Edinburgh, Cambridge Sheffield Research day. The presentation discussed the findings during my PhD in the relationship between the membrane potential of Gram-negatives and membrane permeability. 

# 2020 LMB Symposium
Here is a [link](../files/scm_NECS_presentation.pdf) to my talk to the LMB symposium 2020. 

{% if site.talkmap_link == true %}

<p style="text-decoration:underline;"><a href="/talkmap.html">See a map of all the places I've given a talk!</a></p>

{% endif %}

{% for post in site.talks reversed %}
  {% include archive-single-talk.html %}
{% endfor %}
