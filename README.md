### Setup

To Run this example, follow these steps:

1. Create a `.env` file in root and set the following variables:

```
LANGCHAIN_API_KEY="your-key"
LANGSMITH_PROJECT_NAME="your-project-name"
OPENAI_API_KEY="your-openai-api-key"
```

2. from root, run `yarn` and then `yarn dev`

3. hit the following GET endpoint: `http://localhost:3002/ai/trigger`

### Outcome:

You'll notice the following:

There are 3 api calls to openai:

1. the first one succeeds (logs results to console _and_ langsmith)

Then in the trace group:

2. the second one stays in pending forever in langsmith (logs results to console, remains in _pending_ forever in langsmith)

3. the third one succeeds (logs results to console _and_ langsmith)

This replicates 100% of the time (out of ~20 or so attempts, some of them separated >12 hours apart).

### The Difference Between Calls 2 and 3

Both calls are inside of a trace group (i.e. a chain). The only difference is that the 2nd call happens in a separate function, and the 3rd one does not. Other than that, they're the identical code.

The hanging still occurs even if the third call is removed, it's just there to illustrate the bug.
