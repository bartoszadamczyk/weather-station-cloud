# Weather Station Cloud

[![Lint App](https://github.com/bartoszadamczyk/weather-station-cloud/actions/workflows/lint_app.yml/badge.svg?branch=main)](https://github.com/bartoszadamczyk/weather-station-cloud/actions/workflows/lint_app.yml)
[![Lint Serverless](https://github.com/bartoszadamczyk/weather-station-cloud/actions/workflows/lint_serverless.yml/badge.svg?branch=main)](https://github.com/bartoszadamczyk/weather-station-cloud/actions/workflows/lint_serverless.yml)
[![Lint Terraform](https://github.com/bartoszadamczyk/weather-station-cloud/actions/workflows/lint_terraform.yml/badge.svg?branch=main)](https://github.com/bartoszadamczyk/weather-station-cloud/actions/workflows/lint_terraform.yml)
[![License: MIT](https://img.shields.io/github/license/bartoszadamczyk/weather-station-cloud)](https://github.com/bartoszadamczyk/weather-station-cloud/blob/main/LICENSE)

Cloud based Raspberry Pi weather station

### Repositories

- [Cloud App](https://github.com/bartoszadamczyk/weather-station-cloud)
    - [React App](https://github.com/bartoszadamczyk/weather-station-cloud/app) - Netlify, TypeScript, React, Immer,
      WebSockets, i18next, styled-components, Sentry, ESLint GitHub Actions
    - [Serverless API](https://github.com/bartoszadamczyk/weather-station-cloud/serverless) - Serverless, AWS API
      Gateway (with WebSockets), DynamoDB, SQS, TypeScript, AJV, Sentry, ESLint, GitHub Actions
    - [Terraform](https://github.com/bartoszadamczyk/weather-station-cloud/terraform) - Terraform, TFLint, GitHub
      Actions
- [Raspberry Pi](https://github.com/bartoszadamczyk/weather-station-rpi) - Raspberry Pi, balena.io, Docker, Python,
  AsyncIO, SQS, Mypy, Black, Flake8, Sentry and GitHub Actions

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

- Variables in API, and data pipelines should use `snake_case`
- SQL DBs should use `snake_case`
- DynamoDB should use `camelCase`
- Constant values in:
    - Python: `const FOO = "foo"`
    - TypeScript: `const Foo = "foo"`
- Time should be stored as timestamp with milliseconds without coma
