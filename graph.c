// #include <stdio.h>
// #include <stdlib.h>
// #include <string.h>
// #include "tinyexpr.h"

// int main()
// {
//     char expr[256];

//     printf("Enter a mathematical expression in x (e.g., x^2 + 3*x + 1): ");
//     fgets(expr, sizeof(expr), stdin);
//     expr[strcspn(expr, "\n")] = '\0'; // Remove newline

//     FILE *fp = fopen("data.csv", "w");
//     if (!fp)
//     {
//         perror("Unable to open output file");
//         return 1;
//     }

//     fprintf(fp, "# %s\n", expr); // add comment/header

//     double x, y;
//     for (x = -10.0; x <= 10.0; x += 0.1)
//     {
//         te_variable vars[] = {{"x", &x}};
//         int err;
//         te_expr *e = te_compile(expr, vars, 1, &err);

//         if (e)
//         {
//             y = te_eval(e);
//             te_free(e);
//             fprintf(fp, "%.4f,%.4f\n", x, y);
//         }
//         else
//         {
//             fprintf(stderr, "Compile error at %d\n", err);
//             fclose(fp);
//             return 1;
//         }
//     }

//     fclose(fp);
//     printf("Done. Output written to data.csv\n");

//     return 0;
// }
