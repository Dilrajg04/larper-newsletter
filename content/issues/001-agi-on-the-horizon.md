---
slug: 001-agi-on-the-horizon
title: "What Even Is AI? A Beginner's Guide to What's Actually Going On"
date: "2026-04-07"
issue: 1
description: "Everyone's talking about AI, but what is it really? This week we break down the basics — what these models actually do, why they sometimes get things wrong, and what words like 'reasoning' and 'benchmark' actually mean."
tags: ["beginner", "AI basics", "LLMs", "how it works"]
coverImage: "/images/issues/001-cover.svg"
buzzword:
  term: "Large Language Model (LLM)"
  definition: "An AI system trained on enormous amounts of text — think most of the internet — that learns to predict what word comes next. That's it. Everything you see ChatGPT or Claude do (answering questions, writing essays, writing code) comes from being really, really good at that one trick."
  examples:
    - "ChatGPT is a large language model — it was trained on billions of web pages and books so it could learn patterns in how humans write."
    - "My professor said the LLM got the answer wrong because it was 'hallucinating' — it predicted confident-sounding words that happened to be false."
    - "When you type a question into an AI chatbot, the large language model generates a response one word at a time based on probability."
---

## So What Is AI, Really?

You've probably heard the word "AI" thrown around constantly — in the news, in class, from your relatives at dinner. But what actually is it?

Here's the simple version: the AI tools people talk about most right now (ChatGPT, Claude, Gemini) are called **large language models**. They work by reading a huge amount of text — basically most of the internet, plus millions of books — and learning the patterns of how words follow each other.

When you ask one a question, it doesn't "look up" the answer like a search engine. It predicts what a helpful, accurate response would look like, word by word, based on everything it read during training.

That's why it sounds so confident. And it's also why it sometimes makes things up — it's generating text that *sounds right*, not necessarily text that *is* right.

---

## Why Does It Sometimes Get Things Wrong?

This trips a lot of people up. If AI read the entire internet, how does it still get basic facts wrong?

The short answer: it's a pattern matcher, not a fact database.

Imagine if you read every cookbook ever written, but never tasted food. You'd be great at describing recipes, predicting what goes well together, and writing convincing food reviews — but you might occasionally confuse salt and sugar because they appeared in similar contexts.

That's roughly the situation AI is in. It's very good at language patterns. It's less reliably good at facts.

This is called **hallucination** — when an AI generates something that sounds plausible but is just wrong. It's one of the biggest open problems in the field right now.

---

## What Is a "Benchmark"?

You'll see this word constantly in AI news. A benchmark is basically a standardized test for AI — a set of questions or tasks where researchers know the correct answers, so they can measure how well a model does.

When a company says "our new model beats everything else on MMLU," they mean it scored higher than other AI systems on a specific test designed to measure general knowledge.

**The catch:** companies often pick benchmarks where their model happens to do well. A model that scores 90% on a coding benchmark might still struggle to write code that actually runs in your project. Always read benchmark claims with a little skepticism.

---

## What About "Reasoning Models"?

You might have seen headlines about AI that can "reason" or "think step by step." These are models trained to slow down and work through problems before answering — kind of like showing your work on a math test.

They're better at hard problems like math, logic puzzles, and complex coding tasks. The tradeoff is they're slower and more expensive to run. For simple questions, a regular AI is fine. For tricky multi-step problems, a reasoning model does better.

---

## Where Should You Start?

If you want to actually try these tools:

- **ChatGPT** (openai.com) — free tier available, most well-known
- **Claude** (claude.ai) — often considered better at writing and analysis
- **Gemini** (gemini.google.com) — Google's version, integrates with Google Docs

You don't need to know how they work to use them. But knowing the basics — like the hallucination problem — means you'll use them smarter than most people already do.
