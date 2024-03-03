## Known issues

### (minor) Not allowed strings values

There seems to be a problem with string fields in the Admin panel.

Where entering a string which seems like an hour format (for example "2:56"), it is being recognized as number
and might prevent site from updating.

Best is to avoid hour-like strings, as values set in admin panel fields.

But if there is particular need for such strings, a problem with site update seem to be avoidable by adding an additional " " space or any other character in the string for example "2:56 am" or "2:56 any character here".

### Multiple same values

At the time of writing - multiple same answers (for example in different categories) may produce not known results (might be better to avaoid).

Multiple same subcategories within the same Quiz alsho should be avoided.
