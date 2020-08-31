#  Code Review

## Code Changes Needed


- More Modularity in Book Searching Code and Reading List Component
- One should use the optimize way to deal with Service calls
- Date pipe does not work for null values . Should be used custom pipes here 
- Actions should follow a standard naming style i.e.:  confirmedAction, ActionSuccess etc...
- Use of different names/types, property names limits re-use of reducers/effects


## Accessibility checks manually

- Needed to check above items on reading list and search results list as Lighthouse didn't run on those elements



## Acessibility check via Lighthouse tool

### Names and labels

- ***Buttons do not have an accessible name***
  - Failing item the icon only search button (actually all/most icon buttons)
    - Added `aria-label` to icon buttons: search, reading list close, remove from reading list
      - remove from reading list already done
    - Reading List navigation bar, and Want to Read buttons misses aria tags

### Contrast

- ***Background and foreground colors do not have a sufficient contrast ratio***
  - Button in nav bar
    - Change background color?
      - Changed pink-accent color
    - Couldn't read text in empty reading list (didn't notice it was there really)
      - Increased font weight to normal and lowered  gray shade like body text
    - Increase weight?
    - False positive white on "transparent" background

