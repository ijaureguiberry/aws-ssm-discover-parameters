# AWS SSM Discover Parameters

Fetches SSM parameter store values using a path prefix and returns a string of lines,
where each line has pairs `ENV_VAR_NAME=ssm_parameter_store_arn` to be used later in
`amazon-ecs-render-task-definition`

## Usage

```yaml
- name: Fetch SSM parameter
  id: render-secrets
  uses: ijaureguiberry/aws-ssm-discover-parameters@v0.0.1
  with:
    region: us-east-2
    path: /prod/service/
```

The `path` should be a prefix of the SSM parameters store to fetch, like `/prod/my_api/`.

It outputs pairs `ENV_VAR_NAME=ssm_parameter_store_arn`, one on each line, as expected in
`amazon-ecs-render-task-definition` https://github.com/aws-actions/amazon-ecs-render-task-definition

Output is stored in `discovered-secrets`

## LICENSE

MIT
