insert into "users" ("username", "hashedPassword")
values ('Testing-Account', '$argon2i$v=19$m=4096,t=3,p=1$oi4TCKmPoi9jXXD+7vDK4g$0Hccmnie/JCrNidv5NYhnfeDmfCLOqk7XYeHqjdiYcc');

insert into "code-journal" ("html", "css","javascript","title","imageUrl","description","userId","shared","sharedEdit")
values ('<h1>Hello World</h1>', 'h1{color:red}','document.body.style.background="yellow"','Demo Title','https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80','Demo description',1,true,false);

insert into "comments"("userId","entryId","comments")
values (1,1,'hihi')
