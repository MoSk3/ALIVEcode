FROM openjdk:15

COPY . /src/java

WORKDIR /src/java

RUN ["javac", "ServerAS/src/Server.java"]

ENTRYPOINT ["java", "Server"]