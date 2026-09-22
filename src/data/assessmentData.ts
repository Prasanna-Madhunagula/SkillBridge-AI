import { SkillAssessment } from '../types';

export const COMPREHENSIVE_SKILL_ASSESSMENTS: Record<string, SkillAssessment> = {
  JavaScript: {
    skillName: 'JavaScript',
    timeMinutes: 5,
    questions: [
      {
        id: 1,
        question: 'What will be logged to the console by the following code?',
        codeSnippet: `console.log(typeof null);\nconsole.log(typeof undefined);`,
        options: [
          '"object" and "undefined"',
          '"null" and "undefined"',
          '"object" and "null"',
          '"undefined" and "undefined"',
        ],
        correctIndex: 0,
        explanation: 'In JavaScript, typeof null is a legacy quirk that returns "object", whereas typeof undefined correctly returns "undefined".',
      },
      {
        id: 2,
        question: 'Which method returns a NEW array containing only elements that meet a specified condition without mutating the original array?',
        codeSnippet: `const numbers = [10, 25, 30, 45];`,
        options: ['numbers.filter()', 'numbers.map()', 'numbers.forEach()', 'numbers.splice()'],
        correctIndex: 0,
        explanation: 'Array.prototype.filter() creates a shallow copy filtered down to elements that pass the predicate test.',
      },
      {
        id: 3,
        question: 'What is the output order of the following asynchronous code?',
        codeSnippet: `console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');`,
        options: ['1, 4, 3, 2', '1, 2, 3, 4', '1, 4, 2, 3', '4, 1, 3, 2'],
        correctIndex: 0,
        explanation: 'Synchronous code runs first (1, 4). Microtasks (Promise.then) run next (3), and macrotasks (setTimeout) run last (2).',
      },
      {
        id: 4,
        question: 'What is the primary difference between let and var in JavaScript?',
        options: [
          'let has block scope, while var has function scope and gets hoisted initialized to undefined',
          'var cannot be reassigned, while let can be reassigned',
          'let is hoisted without a temporal dead zone',
          'var creates immutable bindings',
        ],
        correctIndex: 0,
        explanation: 'let is block-scoped and temporal-dead-zone protected, whereas var is function-scoped.',
      },
    ],
  },

  HTML: {
    skillName: 'HTML',
    timeMinutes: 5,
    questions: [
      {
        id: 1,
        question: 'Which HTML5 element represents self-contained content that could be independently distributable or reusable?',
        options: ['<article>', '<section>', '<div>', '<aside>'],
        correctIndex: 0,
        explanation: '<article> is designated for standalone compositions like blog posts, news stories, or forum threads.',
      },
      {
        id: 2,
        question: 'What is the accessibility purpose of the "alt" attribute on an <img> tag?',
        options: [
          'Provides alternative descriptive text for screen readers and when images fail to render',
          'Specifies the tooltip shown on hover',
          'Forces the image to maintain exact aspect ratio',
          'Directs browser caching algorithms',
        ],
        correctIndex: 0,
        explanation: 'The alt attribute provides text equivalents for assistive technologies like screen readers.',
      },
      {
        id: 3,
        question: 'Which attribute ensures an <input> must be filled before form submission?',
        options: ['required', 'validate', 'mandatory', 'strict'],
        correctIndex: 0,
        explanation: 'The required boolean attribute activates native browser form validation before submitting.',
      },
      {
        id: 4,
        question: 'What does the <!DOCTYPE html> declaration at the very top of a document accomplish?',
        options: [
          'Instructs the browser to render the page in standard compliance mode rather than quirks mode',
          'Loads HTML5 polyfills from the CDN',
          'Validates the syntax with the W3C server',
          'Enforces HTTPS connections',
        ],
        correctIndex: 0,
        explanation: '<!DOCTYPE html> prevents browsers from switching into quirks mode, ensuring modern standard rendering.',
      },
    ],
  },

  CSS: {
    skillName: 'CSS',
    timeMinutes: 5,
    questions: [
      {
        id: 1,
        question: 'In the standard CSS box model, what constitutes the total rendered width of an element with "box-sizing: content-box"?',
        options: [
          'width + padding + border + margin',
          'width only',
          'width + padding + border (margin excluded from box width)',
          'width + margin',
        ],
        correctIndex: 2,
        explanation: 'In content-box, width applies only to content; padding and border add to the total element dimension.',
      },
      {
        id: 2,
        question: 'Which CSS Flexbox property controls alignment along the cross-axis?',
        options: ['align-items', 'justify-content', 'flex-direction', 'align-content'],
        correctIndex: 0,
        explanation: 'justify-content aligns items along the main axis, whereas align-items aligns items along the cross axis.',
      },
      {
        id: 3,
        question: 'What is the specificity hierarchy of CSS selectors from highest to lowest?',
        options: [
          'Inline styles > ID > Class/Attribute/Pseudo-class > Element',
          'ID > Inline styles > Class > Element',
          'Class > ID > Inline styles > Element',
          'Element > Class > ID > Inline styles',
        ],
        correctIndex: 0,
        explanation: 'Specificity ranks: Inline (1,0,0,0) > ID (0,1,0,0) > Class/Attribute/Pseudo-class (0,0,1,0) > Element (0,0,0,1).',
      },
      {
        id: 4,
        question: 'Which value of "position" removes an element from normal document flow and positions it relative to its closest positioned ancestor?',
        options: ['absolute', 'relative', 'fixed', 'sticky'],
        correctIndex: 0,
        explanation: 'position: absolute positions relative to the nearest ancestor having position other than static.',
      },
    ],
  },

  React: {
    skillName: 'React',
    timeMinutes: 5,
    questions: [
      {
        id: 1,
        question: 'Why should you never mutate state directly in React (e.g., state.count = 5)?',
        options: [
          'React relies on shallow reference equality checks (Object.is); direct mutation skips re-rendering',
          'It throws an immediate JavaScript syntax error in the browser',
          'It deletes the virtual DOM node permanently',
          'It forces an infinite component mount loop',
        ],
        correctIndex: 0,
        explanation: 'Direct mutations do not change the object identity reference, so React cannot detect state changes.',
      },
      {
        id: 2,
        question: 'When does a useEffect hook with an empty dependency array [] execute?',
        options: [
          'Once after the initial mount only',
          'After every single render of the component',
          'Only when props change',
          'Before initial paint synchronously',
        ],
        correctIndex: 0,
        explanation: 'An empty dependency array indicates the effect runs once after initial mount and cleans up on unmount.',
      },
      {
        id: 3,
        question: 'What is the purpose of the "key" prop when rendering dynamic lists in React?',
        options: [
          'It provides a stable identity so React can efficiently reconcile and reuse DOM nodes',
          'It automatically sorts items alphabetically',
          'It applies custom CSS classes',
          'It attaches a global event listener',
        ],
        correctIndex: 0,
        explanation: 'Keys identify which items have changed, been added, or been removed, minimizing expensive DOM mutations.',
      },
      {
        id: 4,
        question: 'Which hook should be used to memoize the result of an expensive calculation across renders?',
        options: ['useMemo', 'useCallback', 'useRef', 'useEffect'],
        correctIndex: 0,
        explanation: 'useMemo caches the calculated value and re-computes only when its dependencies change.',
      },
    ],
  },

  'Node.js': {
    skillName: 'Node.js',
    timeMinutes: 5,
    questions: [
      {
        id: 1,
        question: 'How does Node.js handle thousands of concurrent I/O operations despite having a single main execution thread?',
        options: [
          'Via the libuv non-blocking event loop and worker thread pool for asynchronous I/O delegation',
          'By spinning up an OS process for each incoming request',
          'By blocking execution until each network packet arrives',
          'Through browser WebAssembly threads',
        ],
        correctIndex: 0,
        explanation: 'Node.js utilizes the libuv event loop to offload asynchronous I/O operations to OS-level kernel abstractions or thread pools.',
      },
      {
        id: 2,
        question: 'In Express.js, what must a middleware function call to pass control to the next middleware in the pipeline?',
        options: ['next()', 'res.continue()', 'app.forward()', 'return true'],
        correctIndex: 0,
        explanation: 'Middleware functions accept (req, res, next) and must execute next() unless sending a terminating response.',
      },
      {
        id: 3,
        question: 'What is the main difference between process.nextTick() and setImmediate() in Node.js?',
        options: [
          'process.nextTick fires immediately after the current operation before the event loop advances; setImmediate fires in the check phase',
          'setImmediate fires before process.nextTick',
          'process.nextTick is only available in browser environments',
          'There is no difference; they are exact aliases',
        ],
        correctIndex: 0,
        explanation: 'nextTick queue runs immediately after the current synchronous code finishes, before other event loop phases.',
      },
      {
        id: 4,
        question: 'Which Node.js core module provides utilities for handling and transforming file paths cross-platform?',
        options: ['path', 'fs', 'url', 'os'],
        correctIndex: 0,
        explanation: 'The "path" module provides functions like path.join and path.resolve handling Windows vs POSIX separators.',
      },
    ],
  },

  SQL: {
    skillName: 'SQL',
    timeMinutes: 5,
    questions: [
      {
        id: 1,
        question: 'Which clause in SQL is used to filter results AFTER aggregate functions have been computed?',
        options: ['HAVING', 'WHERE', 'ORDER BY', 'GROUP BY'],
        correctIndex: 0,
        explanation: 'WHERE filters rows before aggregation; HAVING filters aggregate groups after GROUP BY.',
      },
      {
        id: 2,
        question: 'What does a LEFT OUTER JOIN return?',
        options: [
          'All rows from the left table, and matched rows from the right table (with NULLs for non-matches)',
          'Only rows that match in both tables',
          'All rows from both tables unconditionally',
          'Only rows with non-null values in all columns',
        ],
        correctIndex: 0,
        explanation: 'LEFT JOIN keeps all left rows and fills unmatched right rows with NULL.',
      },
      {
        id: 3,
        question: 'What is the purpose of a PRIMARY KEY constraint in a relational table?',
        options: [
          'Uniquely identifies each record and strictly prohibits NULL values',
          'Allows duplicate keys for fast indexing',
          'Encrypts column values at rest',
          'Auto-generates foreign key relationships',
        ],
        correctIndex: 0,
        explanation: 'A PRIMARY KEY enforces non-null uniqueness on designated identifying columns.',
      },
      {
        id: 4,
        question: 'What will happen when you execute a DELETE FROM table_name without a WHERE clause?',
        options: [
          'All records from the table will be deleted while preserving the table schema',
          'The database will throw a syntax error',
          'Only the first row is deleted',
          'The entire table structure is dropped from the catalog',
        ],
        correctIndex: 0,
        explanation: 'DELETE without WHERE deletes all rows; the schema definition remains intact.',
      },
    ],
  },

  Git: {
    skillName: 'Git',
    timeMinutes: 5,
    questions: [
      {
        id: 1,
        question: 'Which Git command moves changes from the working directory into the staging area (index)?',
        options: ['git add', 'git commit', 'git push', 'git checkout'],
        correctIndex: 0,
        explanation: 'git add stages working tree modifications for the next commit snapshot.',
      },
      {
        id: 2,
        question: 'What is the primary difference between git merge and git rebase?',
        options: [
          'git merge preserves history with a merge commit, while git rebase rewrites commits linearly onto a new base',
          'git rebase deletes old commits permanently without saving code',
          'git merge only works on the master/main branch',
          'git rebase creates a three-way commit',
        ],
        correctIndex: 0,
        explanation: 'Rebase reapplies commits on top of another base tip, creating a linear history; merge creates a merge commit.',
      },
      {
        id: 3,
        question: 'How do you safely stash away uncommitted local changes without creating a permanent commit?',
        options: ['git stash', 'git discard', 'git reset --hard', 'git pop'],
        correctIndex: 0,
        explanation: 'git stash temporarily shelves modified tracked files so you can work with a clean working directory.',
      },
      {
        id: 4,
        question: 'What does git checkout -b feature-auth accomplish?',
        options: [
          'Creates a new branch named feature-auth and switches to it in one command',
          'Deletes the feature-auth branch',
          'Downloads feature-auth from remote origin',
          'Reverts changes on the current branch',
        ],
        correctIndex: 0,
        explanation: 'The -b flag instructs checkout (or git switch -c) to create and switch to the new branch.',
      },
    ],
  },

  Python: {
    skillName: 'Python',
    timeMinutes: 5,
    questions: [
      {
        id: 1,
        question: 'What will the following Python list slice produce?',
        codeSnippet: `nums = [1, 2, 3, 4, 5]\nprint(nums[1:4])`,
        options: ['[2, 3, 4]', '[1, 2, 3]', '[2, 3, 4, 5]', '[1, 2, 3, 4]'],
        correctIndex: 0,
        explanation: 'Python slices are inclusive of start (index 1 -> 2) and exclusive of stop (index 4 -> stops before value 5).',
      },
      {
        id: 2,
        question: 'Which built-in data type in Python is IMMUTABLE?',
        options: ['tuple', 'list', 'dict', 'set'],
        correctIndex: 0,
        explanation: 'Tuples are immutable sequences in Python; their elements cannot be reassigned or modified in place.',
      },
      {
        id: 3,
        question: 'What does the *args parameter syntax allow a Python function to accept?',
        options: [
          'An arbitrary number of positional arguments packaged as a tuple',
          'Keyword arguments packaged as a dictionary',
          'Only list inputs',
          'Memory address pointers',
        ],
        correctIndex: 0,
        explanation: '*args packages an arbitrary count of positional arguments into a tuple parameter.',
      },
      {
        id: 4,
        question: 'In Python, what does a list comprehension [x**2 for x in range(4)] return?',
        options: ['[0, 1, 4, 9]', '[1, 4, 9, 16]', '[0, 2, 4, 6]', '(0, 1, 4, 9)'],
        correctIndex: 0,
        explanation: 'range(4) yields 0, 1, 2, 3; squared values produce [0, 1, 4, 9].',
      },
    ],
  },

  Statistics: {
    skillName: 'Statistics',
    timeMinutes: 5,
    questions: [
      {
        id: 1,
        question: 'Which measure of central tendency is least sensitive to extreme outliers in skewed data?',
        options: ['Median', 'Mean', 'Variance', 'Standard Deviation'],
        correctIndex: 0,
        explanation: 'The median represents the middle value and is not pulled by extreme high or low outlier values.',
      },
      {
        id: 2,
        question: 'What does a p-value less than alpha (typically 0.05) indicate in statistical hypothesis testing?',
        options: [
          'Reject the null hypothesis; the observed result is statistically significant',
          'Accept the null hypothesis as undeniably true',
          'The data contains zero measurement variance',
          'The alternative hypothesis is mathematically disproven',
        ],
        correctIndex: 0,
        explanation: 'When p < 0.05, we reject the null hypothesis because the observed data is unlikely under null assumptions.',
      },
      {
        id: 3,
        question: 'What does the Central Limit Theorem state?',
        options: [
          'The distribution of sample means approaches a normal distribution as sample size grows large, regardless of population shape',
          'All random variables are normally distributed in nature',
          'The sample mean is always exactly equal to the median',
          'Correlation implies direct causation',
        ],
        correctIndex: 0,
        explanation: 'The Central Limit Theorem proves that sample mean distributions converge to normal with sufficient sample size.',
      },
      {
        id: 4,
        question: 'What does a Pearson correlation coefficient (r) of -0.85 imply between two variables?',
        options: [
          'Strong negative linear relationship: as one variable increases, the other systematically decreases',
          'Weak positive linear relationship',
          'No measurable association',
          'The dependent variable was incorrectly calculated',
        ],
        correctIndex: 0,
        explanation: 'r = -0.85 indicates a strong inverse linear association between the two features.',
      },
    ],
  },

  Pandas: {
    skillName: 'Pandas',
    timeMinutes: 5,
    questions: [
      {
        id: 1,
        question: 'In Pandas, what is the primary difference between .loc[] and .iloc[]?',
        options: [
          '.loc is label-based indexing; .iloc is 0-indexed integer position-based indexing',
          '.iloc is label-based; .loc is integer-based',
          '.loc only accesses columns; .iloc only accesses rows',
          '.iloc mutates the original DataFrame while .loc returns a copy',
        ],
        correctIndex: 0,
        explanation: '.loc[] accesses via label names; .iloc[] accesses purely via integer matrix coordinates.',
      },
      {
        id: 2,
        question: 'Which method is used in Pandas to aggregate data by one or more categories?',
        options: ['df.groupby()', 'df.aggregate_by()', 'df.categorize()', 'df.split()'],
        correctIndex: 0,
        explanation: 'df.groupby() splits the data into groups based on criteria, applies aggregate functions, and combines results.',
      },
      {
        id: 3,
        question: 'How do you check for missing or NaN values across all columns of a DataFrame?',
        options: ['df.isnull().sum()', 'df.find_nulls()', 'df.empty_cells()', 'df.missing()'],
        correctIndex: 0,
        explanation: 'df.isnull().sum() returns the count of null/NaN values per column.',
      },
      {
        id: 4,
        question: 'What does the parameter "inplace=True" do in methods like df.drop()?',
        options: [
          'Modifies the original DataFrame directly without returning a new copy',
          'Exports the modified data to a CSV file',
          'Validates data integrity constraints',
          'Reverses the operation automatically on error',
        ],
        correctIndex: 0,
        explanation: 'inplace=True mutates the underlying DataFrame object directly rather than returning a new object.',
      },
    ],
  },

  NumPy: {
    skillName: 'NumPy',
    timeMinutes: 5,
    questions: [
      {
        id: 1,
        question: 'Why are NumPy ndarrays significantly faster than Python native lists for numerical computations?',
        options: [
          'Contiguous memory allocation and vectorized operations implemented in compiled C without Python interpreter overhead',
          'They use cloud GPUs by default',
          'They do not store data types',
          'They skip arithmetic precision checks',
        ],
        correctIndex: 0,
        explanation: 'NumPy arrays store elements in homogeneous, contiguous blocks of memory allowing SIMD hardware acceleration.',
      },
      {
        id: 2,
        question: 'What feature allows NumPy to perform element-wise operations on arrays of different shapes?',
        options: ['Broadcasting', 'Vector streaming', 'Shape projection', 'Dynamic casting'],
        correctIndex: 0,
        explanation: 'NumPy broadcasting describes how arrays with compatible shapes are aligned during element-wise operations.',
      },
      {
        id: 3,
        question: 'How do you calculate the dot product of two 2D arrays (matrix multiplication)?',
        options: ['np.dot(A, B) or A @ B', 'A * B', 'np.multiply_matrices(A, B)', 'A.cross(B)'],
        correctIndex: 0,
        explanation: 'A @ B or np.dot(A, B) computes matrix multiplication; A * B computes element-wise multiplication.',
      },
      {
        id: 4,
        question: 'Which method reshapes a 1D array of 12 elements into a 3x4 matrix without modifying data?',
        options: ['arr.reshape(3, 4)', 'arr.resize(3, 4)', 'arr.transpose(3, 4)', 'arr.flatten(3, 4)'],
        correctIndex: 0,
        explanation: 'arr.reshape(3, 4) returns a new view with the requested dimensions without copying buffer memory.',
      },
    ],
  },

  'Machine Learning': {
    skillName: 'Machine Learning',
    timeMinutes: 5,
    questions: [
      {
        id: 1,
        question: 'What is overfitting in supervised machine learning?',
        options: [
          'Model learns training noise and details too closely, performing poorly on unseen validation data',
          'Model is too simple to capture underlying patterns in both training and test data',
          'Model trains too quickly due to high learning rate',
          'Dataset has more features than samples',
        ],
        correctIndex: 0,
        explanation: 'Overfitting occurs when high variance leads the model to memorize training specifics rather than generalizing.',
      },
      {
        id: 2,
        question: 'Which metric is preferred over accuracy when evaluating a classifier on a heavily imbalanced dataset?',
        options: ['F1-Score / Precision-Recall AUC', 'Raw Accuracy', 'Mean Squared Error', 'R-Squared'],
        correctIndex: 0,
        explanation: 'In imbalanced settings (e.g. 99% negative), accuracy is misleading; F1-score balances precision and recall.',
      },
      {
        id: 3,
        question: 'What is the purpose of k-fold cross-validation?',
        options: [
          'To evaluate model generalization reliability and reduce performance estimation variance across subsets',
          'To speed up model training time by 10x',
          'To eliminate the need for feature engineering',
          'To convert unsupervised models to supervised models',
        ],
        correctIndex: 0,
        explanation: 'Cross-validation splits data into k folds to evaluate generalization robustness across all data points.',
      },
      {
        id: 4,
        question: 'In Ridge Regression (L2 regularization), what penalty is added to the loss function?',
        options: [
          'Sum of squared coefficients (L2 norm) scaled by lambda',
          'Sum of absolute values of coefficients (L1 norm)',
          'Product of features and targets',
          'Number of decision tree leaf nodes',
        ],
        correctIndex: 0,
        explanation: 'Ridge regression penalizes large weights via the L2 norm (squared magnitude) to prevent coefficient explosion.',
      },
    ],
  },

  Excel: {
    skillName: 'Excel',
    timeMinutes: 5,
    questions: [
      {
        id: 1,
        question: 'Which modern Excel function searches a range or array and returns an item corresponding to the first match found, replacing VLOOKUP?',
        options: ['XLOOKUP', 'INDEX/MATCH', 'HLOOKUP', 'SEARCH'],
        correctIndex: 0,
        explanation: 'XLOOKUP works in any direction, defaults to exact matches, and eliminates column-index counting errors.',
      },
      {
        id: 2,
        question: 'What does the "$" symbol denote in a cell reference like $A$1?',
        options: [
          'Absolute reference that locks the column and row when copied across cells',
          'Currency formatting for monetary amounts',
          'Dynamic array formula reference',
          'External workbook link',
        ],
        correctIndex: 0,
        explanation: '$ locks column or row coordinates so dragging or copying formulas preserves that specific target cell.',
      },
      {
        id: 3,
        question: 'Which tool in Excel allows you to summarize, analyze, explore, and present summary data interactively?',
        options: ['PivotTable', 'Power Query Editor', 'Goal Seek', 'Data Validation'],
        correctIndex: 0,
        explanation: 'PivotTables aggregate large datasets dynamically by dragging fields into rows, columns, and value aggregations.',
      },
      {
        id: 4,
        question: 'What formula correctly averages values in range C2:C100 only if corresponding column B equals "Telangana"?',
        options: ['=AVERAGEIF(B2:B100, "Telangana", C2:C100)', '=AVERAGE(C2:C100, IF(B2:B100="Telangana"))', '=SUMIF(B2:B100, "Telangana") / 10', '=VLOOKUP("Telangana", B2:C100, 2)'],
        correctIndex: 0,
        explanation: '=AVERAGEIF(range, criteria, [average_range]) calculates the arithmetic mean for matching cells.',
      },
    ],
  },

  'Power BI': {
    skillName: 'Power BI',
    timeMinutes: 5,
    questions: [
      {
        id: 1,
        question: 'What language is used in Power BI to create custom calculated columns and measures?',
        options: ['DAX (Data Analysis Expressions)', 'M Code', 'SQL', 'VBA'],
        correctIndex: 0,
        explanation: 'DAX is the formula expression language used in Analysis Services, Power BI, and Power Pivot.',
      },
      {
        id: 2,
        question: 'What is the primary function of Power Query (M language) in the Power BI architecture?',
        options: [
          'Extract, Transform, and Load (ETL) data preprocessing before loading into the analytical model',
          'Rendering interactive UI charts and dashboards',
          'Managing tenant security roles',
          'Publishing reports to mobile devices',
        ],
        correctIndex: 0,
        explanation: 'Power Query handles data ingestion, shape transformations, cleaning, and model loading.',
      },
      {
        id: 3,
        question: 'What is the recommended data modeling schema for analytical performance in Power BI?',
        options: ['Star Schema (Fact table surrounded by Dimension tables)', 'Normalized 3NF transactional schema', 'Single denormalized giant table', 'Circular relationship graph'],
        correctIndex: 0,
        explanation: 'Star schemas optimize Power BI VertiPaq in-memory columnar compression and filter propagation.',
      },
      {
        id: 4,
        question: 'Which DAX function overrides the current filter context in a measure calculation?',
        options: ['CALCULATE()', 'FILTER()', 'SUMX()', 'RELATED()'],
        correctIndex: 0,
        explanation: 'CALCULATE evaluates an expression in a modified filter context, enabling complex KPI calculations.',
      },
    ],
  },

  Figma: {
    skillName: 'Figma',
    timeMinutes: 5,
    questions: [
      {
        id: 1,
        question: 'In Figma, what does Auto Layout enable UI designers to build?',
        options: [
          'Dynamic, responsive frames that adapt automatically to content padding, child resizing, and directional flow',
          'Automated 3D rendering perspectives',
          'Pixel-to-code compiler for native Swift apps',
          'Vector pen bezier path smoothing',
        ],
        correctIndex: 0,
        explanation: 'Auto Layout mimics CSS Flexbox, allowing components to adapt fluidly to changing labels and screen sizes.',
      },
      {
        id: 2,
        question: 'What is the advantage of using Figma Components and Variants over detached frames?',
        options: [
          'Global design system consistency: edits to the main component instantly propagate across all instances',
          'Decreases file download speed',
          'Prevents team members from editing the canvas',
          'Exports frames directly into production databases',
        ],
        correctIndex: 0,
        explanation: 'Components create reusable UI elements where changes in the master component sync across all instances.',
      },
      {
        id: 3,
        question: 'Which feature in Figma connects artboards with interactive animations, smart animates, and trigger behaviors?',
        options: ['Prototyping Mode', 'Design Tokens Panel', 'Inspect Tab', 'FigJam Plugin'],
        correctIndex: 0,
        explanation: 'Figma Prototyping allows defining interactions like clicks, drags, hover states, and smooth transitions.',
      },
      {
        id: 4,
        question: 'What is the purpose of Design Tokens / Variables in Figma?',
        options: [
          'Centralizing reusable design values (colors, typography, spacing, corner radius) across light and dark modes',
          'Encrypting vector assets',
          'Exporting SVGs with embedded CSS styles',
          'Connecting to third party REST APIs',
        ],
        correctIndex: 0,
        explanation: 'Figma Variables manage design tokens for colors, numbers, and strings across modes and themes.',
      },
    ],
  },

  'UI Design': {
    skillName: 'UI Design',
    timeMinutes: 5,
    questions: [
      {
        id: 1,
        question: 'What is the minimum WCAG AA contrast ratio required for normal body text against its background?',
        options: ['4.5:1', '3:1', '7:1', '2:1'],
        correctIndex: 0,
        explanation: 'WCAG 2.1 Level AA requires at least 4.5:1 for normal body text and 3:1 for large display text.',
      },
      {
        id: 2,
        question: 'What design principle states that elements placed close to each other are perceived as a related group?',
        options: ['Law of Proximity (Gestalt principle)', 'Fitts’s Law', 'Hick’s Law', 'Miller’s Law'],
        correctIndex: 0,
        explanation: 'The Law of Proximity states objects close together form visual groupings that communicate relationship.',
      },
      {
        id: 3,
        question: 'In visual hierarchy, which attributes most strongly communicate primary importance to the user?',
        options: [
          'High visual contrast, larger scale, intentional negative space, and strategic color accents',
          'Using all-caps on every sentence',
          'Adding blinking animations to all buttons',
          'Placing all text inside colored rectangles',
        ],
        correctIndex: 0,
        explanation: 'Visual hierarchy guides the user’s eye via relative scale, high contrast, whitespace, and typographic weight.',
      },
      {
        id: 4,
        question: 'What is a design system 8pt grid system primarily used for?',
        options: [
          'Ensuring consistent spatial rhythm, margin increments, and harmonious padding across UI components',
          'Setting the font size of all headings to 8px',
          'Limiting the color palette to 8 shades',
          'Displaying 8 columns on mobile viewports',
        ],
        correctIndex: 0,
        explanation: 'An 8-point spatial grid ensures predictable layout rhythm and smooth scaling across varied screen densities.',
      },
    ],
  },

  'UX Research': {
    skillName: 'UX Research',
    timeMinutes: 5,
    questions: [
      {
        id: 1,
        question: 'What is the primary difference between Qualitative and Quantitative UX research?',
        options: [
          'Qualitative explores "why" and "how" through observations and interviews; Quantitative measures "how many" through metrics and stats',
          'Qualitative only uses automated surveys; Quantitative only uses interviews',
          'Quantitative research is always performed after product launch only',
          'Qualitative research does not involve real human users',
        ],
        correctIndex: 0,
        explanation: 'Qualitative research discovers behaviors and motivations; quantitative research measures frequency and scale.',
      },
      {
        id: 2,
        question: 'What is a usability test "think-aloud protocol"?',
        options: [
          'Asking participants to verbalize their thoughts, expectations, and confusion while attempting realistic user tasks',
          'The researcher telling the participant exactly what buttons to press',
          'Having a team discuss user data in a meeting',
          'Generating automated AI synthetic user test recordings',
        ],
        correctIndex: 0,
        explanation: 'Think-aloud asks participants to speak their internal dialogue continuously as they navigate the interface.',
      },
      {
        id: 3,
        question: 'What does a User Journey Map visually represent?',
        options: [
          'The step-by-step experience, emotions, touchpoints, and friction points a persona encounters to accomplish a goal',
          'The database schema diagram of a user profile table',
          'The GPS coordinates of mobile app users',
          'A site map hierarchy of all static URLs',
        ],
        correctIndex: 0,
        explanation: 'A user journey map maps chronological user actions, emotional states, pain points, and opportunities.',
      },
      {
        id: 4,
        question: 'What does the System Usability Scale (SUS) measure?',
        options: [
          'Perceived usability of a product via a standardized 10-item questionnaire scored from 0 to 100',
          'Server CPU response latency during peak traffic',
          'Code test coverage percentage',
          'Net Promoter Score for enterprise sales contracts',
        ],
        correctIndex: 0,
        explanation: 'SUS is a reliable, industry-standard tool for measuring subjective user perceptions of interface usability.',
      },
    ],
  },

  Wireframing: {
    skillName: 'Wireframing',
    timeMinutes: 5,
    questions: [
      {
        id: 1,
        question: 'What is the primary goal of low-fidelity wireframing before creating high-fidelity visuals?',
        options: [
          'To establish content structure, functional layout, and information architecture without aesthetic distractions',
          'To finalize color palettes and font kerning',
          'To generate production CSS code automatically',
          'To create marketing banners for app store submissions',
        ],
        correctIndex: 0,
        explanation: 'Wireframes focus on content placement, hierarchy, and workflow mechanics before committing to visual polish.',
      },
      {
        id: 2,
        question: 'Why are wireframes typically rendered in grayscale / monochrome?',
        options: [
          'To prevent stakeholders from getting distracted by color choices and keep focus on usability and hierarchy',
          'Because Figma cannot support colors in wireframe files',
          'To reduce printing toner costs',
          'Because web browsers render grayscale faster',
        ],
        correctIndex: 0,
        explanation: 'Grayscale ensures discussions remain anchored on spatial layout, affordance, and content prioritization.',
      },
      {
        id: 3,
        question: 'What does an "X" drawn across a box traditionally signify in a low-fidelity wireframe?',
        options: ['Image or media placeholder', 'A deleted component', 'A close/dismiss button', 'A broken database link'],
        correctIndex: 0,
        explanation: 'A rectangle with diagonal crossing lines is the standard architectural convention for an image placeholder.',
      },
      {
        id: 4,
        question: 'How do wireframes bridge user research insights into visual interface design?',
        options: [
          'They translate mental models, key tasks, and user flows into spatial arrangements of screen elements',
          'They replace usability testing entirely',
          'They provide legal copyright protection for UI ideas',
          'They configure backend cloud servers',
        ],
        correctIndex: 0,
        explanation: 'Wireframes translate user journey steps and requirements into concrete screen interfaces.',
      },
    ],
  },

  Prototyping: {
    skillName: 'Prototyping',
    timeMinutes: 5,
    questions: [
      {
        id: 1,
        question: 'What is the main benefit of high-fidelity interactive prototyping before software engineering handoff?',
        options: [
          'Validates realistic interactions and catches usability flaws early, preventing costly engineering refactors',
          'Eliminates the need for frontend developers to write JavaScript',
          'Deploys the application directly to AWS',
          'Guarantees 100% user conversion rates',
        ],
        correctIndex: 0,
        explanation: 'Interactive prototypes simulate real product behavior, allowing teams to test hypotheses at a fraction of code cost.',
      },
      {
        id: 2,
        question: 'In prototyping, what is "micro-interaction"?',
        options: [
          'Subtle, single-purpose feedback animations (e.g. toggle switch, button click ripple, hover state) providing immediate state confirmation',
          'A very short user interview',
          'An API call under 10 bytes',
          'A miniature mobile smartphone screen',
        ],
        correctIndex: 0,
        explanation: 'Micro-interactions communicate status, confirm actions, and bring visual delight to user interfaces.',
      },
      {
        id: 3,
        question: 'What is the difference between a prototype and a wireframe?',
        options: [
          'A wireframe is a static blueprint of layout; a prototype simulates interactive flows, transitions, and state changes',
          'A wireframe has code; a prototype is always paper only',
          'A wireframe is for developers; a prototype is only for executive sales',
          'There is no functional distinction',
        ],
        correctIndex: 0,
        explanation: 'Wireframes depict static structure; prototypes embody dynamic, clickable user interaction.',
      },
      {
        id: 4,
        question: 'What is a "wizard of oz" prototype technique in user testing?',
        options: [
          'A test where users believe the system is autonomous AI, but backend responses are secretly operated by a human researcher',
          'Testing with animation sound effects only',
          'Creating designs inspired by fantasy literature',
          'Using code written entirely by large language models',
        ],
        correctIndex: 0,
        explanation: 'Wizard of Oz simulates automated functionality behind the scenes to test feasibility without building real engines.',
      },
    ],
  },

  'User Research': {
    skillName: 'User Research',
    timeMinutes: 5,
    questions: [
      {
        id: 1,
        question: 'Why should researchers avoid asking leading questions during user interviews (e.g. "Don’t you think this button is easy to see?")?',
        options: [
          'Leading questions bias participant responses and invalidate authentic user feedback',
          'They take longer to translate into multiple languages',
          'They violate website terms of service',
          'Participants will refuse to finish the interview',
        ],
        correctIndex: 0,
        explanation: 'Leading questions introduce researcher bias; neutral, open-ended questions uncover unprompted truth.',
      },
      {
        id: 2,
        question: 'What is a user persona in human-centered design?',
        options: [
          'A research-backed composite archetype representing key goals, behaviors, and pain points of a real target audience segment',
          'A fictional character with made-up hobbies unrelated to the product',
          'The real identity and contact details of an interview participant',
          'A photo of the company CEO',
        ],
        correctIndex: 0,
        explanation: 'Personas synthesize observed patterns from real user research into relatable archetypes that guide product decisions.',
      },
      {
        id: 3,
        question: 'What is card sorting primarily used to research and determine?',
        options: [
          'Information architecture, categorization mental models, and intuitive site navigation taxonomies',
          'Credit card processing transaction speeds',
          'Visual color preferences among teenagers',
          'Game design deck probabilities',
        ],
        correctIndex: 0,
        explanation: 'Card sorting reveals how users naturally group and categorize information and labels.',
      },
      {
        id: 4,
        question: 'What does behavioral user research focus on, compared to attitudinal research?',
        options: [
          'What users actually do in practice (telemetry, heatmaps, task recordings) vs what they say they do',
          'How users rate their feelings on a 5-star survey',
          'How fast users type on a keyboard',
          'The psychological personality test of users',
        ],
        correctIndex: 0,
        explanation: 'Attitudinal is what people say; behavioral is what people actually do, which often differs significantly.',
      },
    ],
  },

  Java: {
    skillName: 'Java',
    timeMinutes: 5,
    questions: [
      {
        id: 1,
        question: 'What is the role of the Java Virtual Machine (JVM) in achieving platform independence ("Write Once, Run Anywhere")?',
        options: [
          'Compiles Java bytecode (.class) into native host machine instructions at runtime via JIT compilation',
          'Translates Java syntax directly into C++ code',
          'Hosts a web server in memory for every application',
          'Directly controls hardware voltage frequencies',
        ],
        correctIndex: 0,
        explanation: 'The JVM executes portable bytecode across different OS platforms via runtime interpretation and JIT compiling.',
      },
      {
        id: 2,
        question: 'What is the difference between "==" and ".equals()" when comparing two String objects in Java?',
        options: [
          '"==" checks memory reference equality; ".equals()" compares actual character value content',
          '".equals()" checks memory addresses; "==" compares characters',
          'There is no difference for Strings in Java',
          '"==" is only valid for numbers and throws an error on Strings',
        ],
        correctIndex: 0,
        explanation: '== compares whether references point to the same memory object; .equals() compares value equality.',
      },
      {
        id: 3,
        question: 'What is the difference between an Abstract Class and an Interface in Java 8+?',
        options: [
          'A class can implement multiple interfaces but extend only one class; abstract classes can have stateful instance variables',
          'Interfaces cannot contain any method implementations whatsoever',
          'Abstract classes cannot have constructors',
          'Interfaces cannot be public',
        ],
        correctIndex: 0,
        explanation: 'Classes support single inheritance with instance state; interfaces support multiple inheritance with default methods.',
      },
      {
        id: 4,
        question: 'How does Java automatic Garbage Collection manage memory reclamation?',
        options: [
          'Identifies and reclaims heap memory occupied by objects that are no longer reachable from any GC root references',
          'Deletes memory immediately when a variable exits a method scope',
          'Requires manual invocation of free() and delete() operators',
          'Reboots the JVM process periodically',
        ],
        correctIndex: 0,
        explanation: 'Garbage collectors traverse the object graph from root references to reclaim unreachable heap memory.',
      },
    ],
  },

  'Spring Boot': {
    skillName: 'Spring Boot',
    timeMinutes: 5,
    questions: [
      {
        id: 1,
        question: 'What core software design pattern is central to the Spring Framework container?',
        options: ['Inversion of Control (IoC) / Dependency Injection (DI)', 'Singleton without interface', 'Active Record Pattern', 'Monolithic Procedural'],
        correctIndex: 0,
        explanation: 'Spring IoC manages bean lifecycles and injects required dependencies into components automatically.',
      },
      {
        id: 2,
        question: 'What does the @SpringBootApplication annotation combine in a Spring Boot application?',
        options: [
          '@Configuration, @EnableAutoConfiguration, and @ComponentScan',
          '@Controller, @Service, and @Repository',
          '@Entity, @Table, and @Id',
          '@RestController and @RequestMapping',
        ],
        correctIndex: 0,
        explanation: '@SpringBootApplication is a meta-annotation encapsulating configuration, auto-configuration, and package component scanning.',
      },
      {
        id: 3,
        question: 'Which annotation is used to create a REST controller where methods serialize return values directly to HTTP response bodies (JSON)?',
        options: ['@RestController', '@Controller', '@Component', '@Service'],
        correctIndex: 0,
        explanation: '@RestController combines @Controller and @ResponseBody, serializing returned DTOs to JSON/XML.',
      },
      {
        id: 4,
        question: 'What is the purpose of Spring Data JPA Repositories (e.g. JpaRepository<Entity, Long>)?',
        options: [
          'Provides complete CRUD, pagination, and derived query operations without writing boilerplate SQL or implementation code',
          'Runs continuous database backups to cloud storage',
          'Creates HTML forms in the browser',
          'Encrypts password fields with SHA-256',
        ],
        correctIndex: 0,
        explanation: 'Spring Data JPA auto-generates repository implementations for CRUD and queries derived from method names.',
      },
    ],
  },

  'REST APIs': {
    skillName: 'REST APIs',
    timeMinutes: 5,
    questions: [
      {
        id: 1,
        question: 'What HTTP method should be used to partially update an existing resource according to REST conventions?',
        options: ['PATCH', 'PUT', 'POST', 'GET'],
        correctIndex: 0,
        explanation: 'PUT replaces an entire resource; PATCH applies partial modifications to an existing resource.',
      },
      {
        id: 2,
        question: 'What does it mean for an HTTP method to be "idempotent"?',
        options: [
          'Making multiple identical requests produces the exact same server resource state as making a single request',
          'The request executes in less than 10 milliseconds',
          'The endpoint requires multi-factor authentication',
          'The response cannot be cached by proxies',
        ],
        correctIndex: 0,
        explanation: 'Methods like GET, PUT, and DELETE are idempotent because executing them repeatedly has the same side effect as once.',
      },
      {
        id: 3,
        question: 'Which HTTP status code signifies that a resource was successfully created on the server?',
        options: ['201 Created', '200 OK', '204 No Content', '302 Found'],
        correctIndex: 0,
        explanation: '201 Created is the standard response for POST requests that successfully provision a new resource.',
      },
      {
        id: 4,
        question: 'What does the REST constraint "Statelessness" mandate?',
        options: [
          'Every client request must contain all information necessary to process it; the server stores no client session context',
          'The server must have zero database tables',
          'Clients are not allowed to store browser cookies',
          'Responses cannot include headers',
        ],
        correctIndex: 0,
        explanation: 'Statelessness means each request is self-contained with authentication tokens and parameters, improving scalability.',
      },
    ],
  },

  'Database Management': {
    skillName: 'Database Management',
    timeMinutes: 5,
    questions: [
      {
        id: 1,
        question: 'What do the ACID properties stand for in relational database transaction management?',
        options: [
          'Atomicity, Consistency, Isolation, Durability',
          'Accuracy, Completeness, Integrity, Dependability',
          'Access, Concurrency, Indexing, Distribution',
          'Authentication, Clustering, Ingestion, Deletion',
        ],
        correctIndex: 0,
        explanation: 'ACID guarantees that database transactions are processed reliably even in power loss or error conditions.',
      },
      {
        id: 2,
        question: 'What is the primary benefit of adding a B-Tree index to a heavily queried foreign key column?',
        options: [
          'Reduces lookup time from O(N) full table scans to O(log N) indexed searches',
          'Compresses the table size on disk by 80%',
          'Prevents duplicate values from ever being inserted',
          'Automatically converts the database to NoSQL',
        ],
        correctIndex: 0,
        explanation: 'Indexes provide logarithmic time lookup structures, avoiding slow sequential table scans.',
      },
      {
        id: 3,
        question: 'What is Database Normalization (e.g. 1NF, 2NF, 3NF) designed to achieve?',
        options: [
          'Eliminate redundant duplicate data and minimize data insertion, update, and deletion anomalies',
          'Increase the number of unindexed columns',
          'Merge all database tables into one large document',
          'Prevent users from running aggregate queries',
        ],
        correctIndex: 0,
        explanation: 'Normalization organizes columns and tables to ensure dependencies are properly enforced and duplication minimized.',
      },
      {
        id: 4,
        question: 'What is the purpose of database Connection Pooling (e.g. HikariCP)?',
        options: [
          'Reuses a pool of active database connections to eliminate the expensive overhead of creating new TCP connections on every request',
          'Replicates tables across multiple data centers',
          'Translates SQL queries to MongoDB syntax',
          'Cleans up orphan records automatically',
        ],
        correctIndex: 0,
        explanation: 'Connection pools maintain active connections ready for borrowing, avoiding socket and handshake latencies.',
      },
    ],
  },
};
