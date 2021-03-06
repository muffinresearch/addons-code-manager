/* eslint-disable no-console */
/* eslint-disable amo/only-tsx-files */
/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line import/no-extraneous-dependencies
const { CLIEngine } = require('eslint');

const { getChangedFiles } = require('./utils');

const NO_ESLINT_ENV_VAR = 'NO_ESLINT';

class EslintCheckReporter {
  constructor() {
    this.eslint = new CLIEngine();
    this.eslintOutput = null;
  }

  isDisabled() {
    return process.env[NO_ESLINT_ENV_VAR] === '1';
  }

  async onRunStart() {
    if (this.isDisabled()) {
      return;
    }

    const files = await getChangedFiles();

    if (!files) {
      throw new Error(`Failed to retrieve files in the eslint check reporter.`);
    }

    const report = this.eslint.executeOnFiles(files);

    if (report.errorCount === 0 && report.warningCount === 0) {
      // All good.
      this.eslintOutput = null;
    } else {
      this.eslintOutput = CLIEngine.getFormatter()(report.results);
    }
  }

  getLastError() {
    if (this.isDisabled()) {
      return undefined;
    }

    console.log('');
    if (this.eslintOutput) {
      console.log(this.eslintOutput);
      console.log(
        `Set ${NO_ESLINT_ENV_VAR}=1 in the environment to disable eslint checks`,
      );
      return new Error('eslint errors');
    }
    console.log('Eslint: no errors 💄 ✨');

    return undefined;
  }
}

module.exports = EslintCheckReporter;
