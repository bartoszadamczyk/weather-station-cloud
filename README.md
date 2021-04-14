# Weather Station Cloud

Cloud based Raspberry Pi weather station

### Repositories

- [Cloud API](https://github.com/bartoszadamczyk/weather-station-cloud)
  - Web Client - Netlify, TypeScript, React, Immer, WebSockets, i18next, styled-components
  - Cloud API - Terraform, Serverless, AWS API Gateway (with WebSockets), DynamoDB, SQS, TypeScript, AJV
- [Raspberry Pi](https://github.com/bartoszadamczyk/weather-station-rpi) - Raspberry Pi, balena.io, Docker, Python,
  AsyncIO, SQS, Mypy, Black, Flake8

![All sensors module](https://github.com/bartoszadamczyk/weather-station-rpi/blob/main/docs/all-sensors-module.jpg?raw=true)

## Serverless vs Terraform

Following [serverless advice](https://www.serverless.com/blog/definitive-guide-terraform-serverless), this project is
using both. Serverless is used to easily deploy lambda code together with app-specific infrastructure. On the other hand
terraform is used to set up shared and persistent parts of infrastructure like data tables that should not be affected
by a serverless teardown or updates.

> ### Managing shared vs. app-specific infrastructure
> While we believe that all infrastructure should be managed with IaC automation, we like to distinguish between the
> infrastructure that’s specific to one application and the infrastructure that’s shared between multiple applications
> in your stack. Those might need to be managed in different ways.
>
> Application-specific infrastructure gets created and torn down as the app gets deployed. You rarely change a piece of
> application-specific infrastructure; you’ll just tear everything down and re-create it from scratch. As the app is
> developed, the infrastructure that supports it also needs to change, sometimes significantly from one deploy to another.
>
> The shared infrastructure, on the other end, rarely gets re-created from scratch and is more stateful. The core set of
> infrastructure (such as the set of security groups and your VPC ID), won’t change between the deploys of your
> application, as they’re probably referenced by many applications in your stack. Those more persistent pieces of
> infrastructure will generally be managed outside of your deploy pipeline.
[[Source](https://www.serverless.com/blog/definitive-guide-terraform-serverless)]

## Naming conventions

### AWS resources

For all AWS resources this project follows naming convention:

- `S3: namespace-app-env-region-[name]`
- `IAM: {account}/app-env-region-[name]`
- `DynamoDB: {account}/{region}/app-env-[name]`

This provides:

- no conflicts with other `accounts`, `regions`, `environments`,
- it is easy to read for humans,
- for a `name`, `region` and `env` we can use wildcard for example in the `IAM` policies.

### Variables and data naming convention

- Variables in database, API, and data pipelines should use `snake_case`
- Time should be stored as timestamp with milliseconds
