---
title: "CodeDjinn: Engineering Simplicity in the Age of AI Complexity"
excerpt: "This weekend I managed to finish a very fun project! I think there are two kinds of bioinformaticians: computer scientists that for one reason or another get into biology..."
date: 28-07-2025
collection: portfolio
---

# CodeDjinn: Engineering Simplicity in the Age of AI Complexity

This weekend I managed to finish a very fun project! I think there are two kinds of bioinformaticians: computer scientists that for one reason or another get into biology, or biologists that for necessity get into computer science. I belong to the second category. Thus, I find myself frequently asking for complex multiflag commands such as `find . -name "*.fastq.gz" -exec zcat {} \; | wc -l`, or `rsync -avz --progress --exclude='*.tmp' /source/data/ user@server:/backup/`, or `docker run -v $(pwd):/data -v /tmp:/tmp --rm biocontainers/samtools samtools view -bS input.sam | samtools sort -o output.bam`. This leads to seconds to minutes to search. The standard solution – web-based or IDE AI assistants – introduces its own inefficiency: context switching. Each lookup requires:

1. Mental context switch from problem-solving to information retrieval
2. Physical context switch from terminal to browser
3. Potential exposure to distractions (notifications, other tabs)
4. Copy-paste operations that introduce error potential
5. Context switch back to terminal and problem state

Thus, in the age of LLMs, I thought, why not build a fast responsive app that is directly there where I need it. My goal was to make something fast, simple and responsive. I thus came up with the idea of CodeDjinn...

## CodeDjinn

What is CodeDjinn, or rather, what is the main idea behind CodeDjinn? CodeDjinn is a lightweight-fast CLI assistant that generates shell commands. That's it. The goal was to be there where you are and come up with quick and simple answers. Building something fast and responsive sounds simple, but it can be complex to implement. Indeed, it taught me a few profound ideas about the nature of tools and human-computer interaction.

First of all, I learned to prioritize – a meditation on essence versus excess. Any of the top-tier models can answer most of the questions that I was intending to address such as `code-djinn -a "count total reads in all fastq files"`. However, it raises a philosophical question: does it make any sense to summon the most powerful models for the simplest of queries? First of all, you'll spend more resources (and money) than necessary . Second, you'll spend also a few extra seconds waiting for an answer that smaller models can provide, which would defeat the initial purpose. Thus, I decided to work with the smallest, fastest models I could find, embracing the principle of "sufficient intelligence."

- **Mistral's Codestral:** Mistral has built a reputation for fast, efficient models, making it a natural choice for this use case.
- **Google's Gemini Flash:** This model demonstrated superior response times in public benchmarks, with Gemini Flash-lite consistently ranking as a top performer.
- **QwQ-32B:** Last but not least, I wanted to explore the edges of the ecosystem. Given that Qwen has been making some noise, I thought, why not embrace the experimental spirit?

The second thing that I learned was about optimizing Python code itself – a journey into the temporal dimension of software. I discovered that each time I called the tool from the CLI, I was "invoking a new CodeDjinn", a fresh consciousness that had to reconstruct its entire reality from scratch. Thus, I implemented a cache system for fast responses – a form of digital memory. I also learned about lazy loading, which meant only the needed libraries were loaded each time.

This was interesting, because in this LLM age, many people have argued that they make us "lazy" and "stupid". However, I see it differently. These tools are amplifiers of curiosity. I would probably never have learned about concepts like lazy loading if not for the fact that nowadays LLMs can make them easily accessible. They democratize knowledge, turning arcane wisdom into accessible understanding.

## Real-World Magic Moments

So, what can CodeDjinn do for you? I focused on a feature set designed for maximum utility. The core functionality includes command generation (ask mode) and safe execution (execute mode). Additionally, I integrated an explanation feature for continuous learning and command understanding. The configuration system supports API key management, shell detection, and prompt customization, allowing users to specify preferred tools and command styles.

After getting done with the building, I started using it in my normal workflow and I was quite amazed about how much it could get done and how it truly helped me to stay in focus on the task I was doing. Here are practical examples demonstrating its capabilities:

```bash
# Counting reads across all samples
code-djinn -x "count total reads in all fastq files"
# Instantly: find . -name "*.fastq" -exec wc -l {} + | awk '{s+=$1} END {print s}'
```

I used to spend minutes crafting that command, each flag a small decision, each pipe a connection between ideas. Now it emerges fully formed, like Athena from Zeus's head.

```bash
# That moment when you need to check memory usage
code-djinn -x "show top 10 memory hungry processes with percentages"
# Conjures: ps aux | sort -rk 4 | head -n 11 
```

```bash
code-djinn -x "show commit history with file changes for last sprint" 
# Magic: git log --oneline --graph --decorate --color --stat --since="2 weeks ago"
```

And below you can see a quick plot of the execution time of some request. I indeed achieved the "sub-second" response time that I was aiming but note that some of the commands require a lot of time to execute, while others are very fast.

<div align="center">
    <img src="/images/portfolio/post_008/execution_time_distribution.png" alt="Comprehensive Comparison" width="80%">
</div>

## Conclusion: The Philosophy of Simple Tools

Here's something I discovered while building this: Is this an agent? No, but I think it is really useful. I don't think we need complex advanced multi-step agents for everything; sometimes getting quick answers can be very useful. CodeDjinn doesn't try to write your entire analysis pipeline, manage your projects, or have philosophical discussions about the nature of genomics (though that would be fascinating). It translates thoughts into shell commands. That's it. And that simplicity is its superpower. Indeed, I believe the future is full of small models and soon this will be a default feature of most OS. But this is just an opinion.

I played around with adding more features – "what if it could also edit files?" "what if it could chain multiple commands intelligently?" But each addition made it slower and more complex. The Unix philosophy remains relevant: do one thing well.

If you wanna try, the tool is available at `pip install code_djinn` – a small djinn in a digital bottle, ready to grant your command-line wishes. If you feel like complaining or asking for more, please open an issue on [the GitHub repo](https://github.com/phisanti/code_djinn/).

## Bonus

The reason I called it CodeDjinn is because in Arabic mithology a djinn (“جن”) is a supernatural creature that can be summoned to do your bidding. In the same way, CodeDjinn is a tool that you can summon to help you with your coding tasks. 