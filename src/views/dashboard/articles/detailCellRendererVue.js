export const DetailCellRenderer = {
    hello: (p1) => {console.log('hello from (JS) ' , p1)},
    name: "JSCompWorker",
    template: `
      <div>
      <form>
        <div>
          <p>
            <label>
              Call Id:<br>
            </label>
          </p>
          <p>
            <label>
              Number:<br>
            </label>
          </p>
          <p>
            <label>
              Direction:<br>
            </label>
          </p>
        </div>
      </form>
      </div>
    `,
    data: function () {
        return {
            firstRecord: {},
        };
    },
  
    methods: {
        // called when the cell is refreshed
        refresh() {
            return false;
        },
    },
};
