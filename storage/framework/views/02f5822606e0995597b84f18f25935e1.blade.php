---
name: inertia-react-development
description: "Develops Inertia.js v2 React client-side applications. Activates when creating React pages, forms, or navigation; using <Link>, <Form>, useForm, or router; working with deferred props, prefetching, or polling; or when user mentions React with Inertia, React pages, React forms, or React navigation."
license: MIT
metadata:
  author: laravel
---
@php
/** @var \Laravel\Boost\Install\GuidelineAssist $assist */
@endphp
# Inertia React development

## Documentation

Use ___SINGLE_BACKTICK___search-docs___SINGLE_BACKTICK___ for detailed Inertia v2 React patterns and documentation.

## Basic usage

### Page components location

Place React page components in the ___SINGLE_BACKTICK___{{ $assist->inertia()->pagesDirectory() }}___SINGLE_BACKTICK___ directory.

### Page component structure

___BOOST_SNIPPET_0___

## Client-side navigation

### Basic Link component

Use ___SINGLE_BACKTICK___<Link>___SINGLE_BACKTICK___ for client-side navigation instead of ___SINGLE_BACKTICK___<a>___SINGLE_BACKTICK___ tags:

___BOOST_SNIPPET_1___

### Link with method

___BOOST_SNIPPET_2___

### Prefetching

Prefetch pages to improve perceived performance:

___BOOST_SNIPPET_3___

### Programmatic navigation

___BOOST_SNIPPET_4___

## Form handling

@if($assist->inertia()->hasFormComponent())
### Form component (recommended)

The recommended way to build forms is with the ___SINGLE_BACKTICK___<Form>___SINGLE_BACKTICK___ component:

___BOOST_SNIPPET_5___

### Form component with all props

___BOOST_SNIPPET_6___

@if($assist->inertia()->hasFormComponentResets())
### Form component reset props

The ___SINGLE_BACKTICK___<Form>___SINGLE_BACKTICK___ component supports automatic resetting:

- ___SINGLE_BACKTICK___resetOnError___SINGLE_BACKTICK___: reset form data when the request fails
- ___SINGLE_BACKTICK___resetOnSuccess___SINGLE_BACKTICK___: reset form data when the request succeeds
- ___SINGLE_BACKTICK___setDefaultsOnSuccess___SINGLE_BACKTICK___: update default values on success

For details, run the ___SINGLE_BACKTICK___search-docs___SINGLE_BACKTICK___ tool with the query ___SINGLE_BACKTICK___form component resetting___SINGLE_BACKTICK___.

___BOOST_SNIPPET_7___
@else
Note: This version of Inertia does not support ___SINGLE_BACKTICK___resetOnError___SINGLE_BACKTICK___, ___SINGLE_BACKTICK___resetOnSuccess___SINGLE_BACKTICK___, or ___SINGLE_BACKTICK___setDefaultsOnSuccess___SINGLE_BACKTICK___ on the ___SINGLE_BACKTICK___<Form>___SINGLE_BACKTICK___ component. Using these props causes errors. To use these props, upgrade to Inertia v2.2.0+.
@endif

For more programmatic control, you can also build forms with the ___SINGLE_BACKTICK___useForm___SINGLE_BACKTICK___ hook. For guidance, run the ___SINGLE_BACKTICK___search-docs___SINGLE_BACKTICK___ tool with the query ___SINGLE_BACKTICK___useForm helper___SINGLE_BACKTICK___.

@endif

### ___SINGLE_BACKTICK___useForm___SINGLE_BACKTICK___ hook

@if($assist->inertia()->hasFormComponent() === false)
In Inertia v2.0.x, build forms with the ___SINGLE_BACKTICK___useForm___SINGLE_BACKTICK___ hook. The ___SINGLE_BACKTICK___<Form>___SINGLE_BACKTICK___ component is not available until v2.1.0+.
@else
For more programmatic control or to follow existing conventions, use the ___SINGLE_BACKTICK___useForm___SINGLE_BACKTICK___ hook:
@endif

___BOOST_SNIPPET_8___

## Inertia v2 features

### Deferred props

Use deferred props to load data after the initial page render:

___BOOST_SNIPPET_9___

### Polling

Use the ___SINGLE_BACKTICK___usePoll___SINGLE_BACKTICK___ hook to refresh data automatically at intervals. The hook cleans up on unmount and throttles polling when the browser tab is inactive.

___BOOST_SNIPPET_10___

___BOOST_SNIPPET_11___

- ___SINGLE_BACKTICK___autoStart___SINGLE_BACKTICK___ (default ___SINGLE_BACKTICK___true___SINGLE_BACKTICK___): set to ___SINGLE_BACKTICK___false___SINGLE_BACKTICK___ to start polling manually with the returned ___SINGLE_BACKTICK___start()___SINGLE_BACKTICK___ function
- ___SINGLE_BACKTICK___keepAlive___SINGLE_BACKTICK___ (default ___SINGLE_BACKTICK___false___SINGLE_BACKTICK___): set to ___SINGLE_BACKTICK___true___SINGLE_BACKTICK___ to prevent throttling when the browser tab is inactive

### WhenVisible (infinite scroll)

Load more data when the user scrolls to a specific element:

___BOOST_SNIPPET_12___

## Common pitfalls

- Using traditional ___SINGLE_BACKTICK___<a>___SINGLE_BACKTICK___ links instead of Inertia's ___SINGLE_BACKTICK___<Link>___SINGLE_BACKTICK___ component (breaks SPA behavior)
- Forgetting to add loading states (skeleton screens) when using deferred props
- Not handling the ___SINGLE_BACKTICK___undefined___SINGLE_BACKTICK___ state of deferred props before data loads
- Using ___SINGLE_BACKTICK___<form>___SINGLE_BACKTICK___ without preventing default submission (use the ___SINGLE_BACKTICK___<Form>___SINGLE_BACKTICK___ component or ___SINGLE_BACKTICK___e.preventDefault()___SINGLE_BACKTICK___)
- Forgetting to check whether the ___SINGLE_BACKTICK___<Form>___SINGLE_BACKTICK___ component is available in your Inertia version
