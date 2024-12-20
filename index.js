const core = require("@actions/core");
const {
  SSMClient,
  GetParametersByPathCommand,
} = require("@aws-sdk/client-ssm");

async function run() {
  try {
    const path = core.getInput("path", { required: true });
    const region = core.getInput("region", { required: true });

    const ssm = new SSMClient({
      region: region,
    });

    core.info(`Fetching SSM parameters from ${region}::${path}/*`);
    let nextToken = "continue";
    let outputParams = [];
    while (nextToken) {
      const command = new GetParametersByPathCommand({
        Path: path,
        WithDecryption: true,
        Query: "Parameters[].[Name,ARN]",
        NextToken: nextToken !== "continue" ? nextToken : null,
      });
      const response = await ssm.send(command);

      const nextParams = response.Parameters.map((parameter) => {
        const name = parameter.Name.split(path)[1]
          .toUpperCase()
          .replaceAll("-", "_");
        const arn = parameter.ARN;
        return `${name}=${arn}`;
      });
      outputParams = outputParams.concat(nextParams);
      nextToken = response.NextToken;
    }

    core.setOutput("discovered-secrets", outputParams.join("\n"));
  } catch (err) {
    core.setFailed(`Action failed with error ${err}`);
  }
}

run();
