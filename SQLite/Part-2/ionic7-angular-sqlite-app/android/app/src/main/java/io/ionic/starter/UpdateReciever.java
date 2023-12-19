package io.ionic.starter;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.getcapacitor.community.database.sqlite.CapacitorSQLite;

import java.io.File;

public class UpdateReciever extends BroadcastReceiver {
  private static final String TAG = UpdateReciever.class.getName();

  @Override
  public void onReceive(Context context, Intent intent) {
    try {
      Log.v(TAG, "$$$$$ in UpdateReciever.onReceive $$$$$");

      File dir = context.getCacheDir();
      deleteDir(dir);
    } catch (Exception e) {
      Log.e(TAG, e.getMessage());
    }
  }

  private boolean deleteDir(File dir) {
    Log.v(TAG, "$$$$$ in deletedir " + dir);
    if (dir != null && dir.isDirectory()) {
      String[] children = dir.list();
      for (int i = 0; i < children.length; i++) {
        boolean success = deleteDir(new File(dir, children[i]));
        if (!success) {
          return false;
        }
      }
      return dir.delete();
    } else if(dir!= null && dir.isFile()) {
      return dir.delete();
    } else {
      return false;
    }
  }
}
