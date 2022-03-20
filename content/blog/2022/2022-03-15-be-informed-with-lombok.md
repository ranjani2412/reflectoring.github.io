---
title: "Be informed with Project Lombok"
categories: ["Java"]
date: 2022-03-15 00:00:00 +1100
modified: 2022-03-15 00:00:00 +1100
authors: ["ranjani"]
description: "A brief on how to and how not to use Project Lombok"
image: images/stock/0010-gray-lego-1200x628-branded.jpg
url: be-informed-with-project-lombok
---

While Project Lombok is a great library, it can have consequences if not used cautiously.
This article focuses on some pointers to be considered when designing an application that uses Lombok.

## What is Lombok
Project Lombok is a java library that helps **reduce boilerplate code** during development by adding a few annotations. This helps the developers **save time, space and improves code readability**.

### Setting up a project with Lombok
To use the Lombok features in a new or an existing project, all we need is to add a dependency to the build file as shown below.
Further, since this library has a compile-time dependency we make the scope `provided` when using Maven. This makes the Lombok libraries available to the compiler, but it is not a dependency of the final deployable jar.

 `Maven`
 ````xml
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.20</version>
        <scope>provided</scope>
    </dependency>
  ````

 `Gradle`
 ````groovy
    compileOnly group: 'org.projectlombok', name: 'lombok', version: '1.18.20'
 ````

As an example, consider the below java class:

 ````java
    public class Book {
        private String isbn;
    
        private String publication;
    
        private String title;
    
        private List<Author> authors;
    
        public Book(String isbn, String publication, String title, List<Author> authors) {
            // Constructor logic goes here
        }
    
        // All getters and setters are explicitly defined here    
    
        public String toString() {
            return "Book(isbn=" + this.getIsbn() + ", publication=" + this.getPublication() + ", title=" + this.getTitle() + ", authors=" + this.getAuthors() + ", genre=" + this.getGenre() + ")";
        }
    }

 ````

Lombok simplifies the above **plain Java class** to this :

 ````java
    @Getter
    @Setter
    @AllArgsConstructor
    @ToString
    public class Book {
        private String isbn;
    
        private String publication;
    
        private String title;
    
        private List<Author> authors;
    }

 ````
The above code looks much cleaner and easier to write and understand.

## How Lombok works
All annotations in Java are processed during compile time by a set of annotation processors. Most annotation processors generate new files or perform compile-time checks. Lombok processes its annotations differently. It modifies the generated classes by changing the **Abstract Syntax Tree (AST)**. **The Java Compiler Specification does not prevent annotation processors from modifying source files.** 
Lombok developers have cleverly used this loophole to their advantage. 
For more information on how annotation processing in Java works, refer here.

## Advantages of Lombok
Let us take a look at some of the most prominent benefits of using Lombok.

### Clean code
With Lombok, we can replace all boiler-plate code with meaningful annotations. This helps the developer focus on business logic.
Also, annotation such as @Data is a convenient shortcut for @ToString, @EqualsAndHashCode, @Getter / @Setter and @RequiredArgsConstructor together.
Since the code is more concise it also helps modification and addition of new fields easier.
List of all available annotations is available here. 

### Simplifies creation of complex objects
The Builder pattern is generally used when we need to create objects that are complex in nature, and we need some flexibility(in constructor arguments) during its creation. 
@Builder annotation simplifies the object creation process.

Consider the below example that demonstrates use of @Builder

 ````java
    @Builder
    public class Account {
        private String acctNo;
        private String acctName;
        private Date dateOfJoin;
        private String acctStatus;
    }
 ````
 Let's use Intellij Idea Delombok feature to understand the code written behind the scenes

 {{% image alt="delombok example" src="images/posts/lombok/delombok.png" %}}

 ````java
    public class Account {
        private String acctNo;
        private String acctName;
        private Date dateOfJoin;
        private String acctStatus;
    
        Account(String acctNo, String acctName, Date dateOfJoin, String acctStatus) {
            this.acctNo = acctNo;
            this.acctName = acctName;
            this.dateOfJoin = dateOfJoin;
            this.acctStatus = acctStatus;
        }
    
        public static AccountBuilder builder() {
            return new AccountBuilder();
        }
    
        public static class AccountBuilder {
            private String acctNo;
            private String acctName;
            private Date dateOfJoin;
            private String acctStatus;
    
            AccountBuilder() {
            }
    
            public AccountBuilder acctNo(String acctNo) {
                this.acctNo = acctNo;
                return this;
            }
    
            public AccountBuilder acctName(String acctName) {
                this.acctName = acctName;
                return this;
            }
    
            public AccountBuilder dateOfJoin(Date dateOfJoin) {
                this.dateOfJoin = dateOfJoin;
                return this;
            }
    
            public AccountBuilder acctStatus(String acctStatus) {
                this.acctStatus = acctStatus;
                return this;
            }
    
            public Account build() {
                return new Account(acctNo, acctName, dateOfJoin, acctStatus);
            }
    
            public String toString() {
                return "Account.AccountBuilder(acctNo=" + this.acctNo + ", acctName=" + this.acctName + ", dateOfJoin=" + this.dateOfJoin + ", acctStatus=" + this.acctStatus + ")";
            }
        }
    }
 ````
The code written with Lombok is much easier to understand than the one above which is too verbose. Internally, Lombok ensures that the standard process of creating the Builder class is followed and replaces the annotation with the verbose code above, hiding all the complexity and making it much more concise.
Now, we can create objects just as any other standard Builder class.
 ````text
    Account account = Account.builder().acctName("Savings")
        .acctNo("A001090")
        .build();
 ````

### Creating immutable objects made easy
Once created, an immutable object cannot be modified. The concept of immutability is vital when creating a Java application. Some of its benefits include 
thread safety, can be cached, can be used as keys in a Collection. The core java has a number of immutable classes such as String, StringBuffer, Integer, Float and so on.
Lombok makes creation of immutable objects easier.

 ````java
    @Value
    @Builder
    public class Person {
        private String firstName;
        private String lastName;
        private String socialSecurityNo;
    }
 ````
The @Value annotation ensures all the steps to create immutable classes are followed
 - **Make the class final**
 - **Make the fields final**
 - **Generate only getters**

In other words the @Value annotation is a shorthand of all of the below Lombok annotations *@Getter*, *@FieldDefaults(makeFinal=true, level=AccessLevel.PRIVATE)*,
*@AllArgsConstructor*, *@ToString*, *@EqualsAndHashCode*.
We can further enforce immutability in the above example by adding **@AllArgsConstructor(access = AccessLevel.PRIVATE)** to make the constructor private and force object creation via the Builder pattern.

These are some benefits of using Lombok and by now you would have realised the **value these annotations can provide to the code**.
However, in my experience of using Lombok, I have noticed developers misusing these annotations and **using them all around making the code messy and prone to errors**. In the next section, I will brief some of the *DONT'S* to keep in mind when working with Lombok.

## Caveats with Lombok




